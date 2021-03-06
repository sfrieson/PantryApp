var pg = require('pg');

require('dotenv').config();
var connection = process.env.PGCONNECT;

var bcrypt = require('bcryptjs');
var crypto = require('crypto');

var Account = {};
var List = require('./list.js');

// ------------------------------------------------
// -------------------- CREATE --------------------
// ------------------------------------------------

Account.new = function(newAcct, callback) {
    pg.connect(connection, function(err, client, done) {
        if(err){return callback(err);}
        console.log("PG.Account.new: Connected");

        var now = Date.now();
        var hash = bcrypt.hashSync(newAcct.password, 8);


        var text = "INSERT INTO accounts(name, passwordhash, team_id, type, created_at, updated_at) " +
        "VALUES ($1, $2, $3, $4, $5, $6) " +
        "RETURNING *";

        client.query(text, [newAcct.username, hash, newAcct.team_id, "user", now, now], function(err, result){
            done();
            if(err){return callback(err);}
            console.log("PG.Account.new: User Created");
            user = result.rows[0];

            //If this user has no team, create an inventory for them.
            if(!user.team_id) {
                List.newInventory(user, function(err, response){
                    if(err)return console.log(err);
                    console.log(response);
                    user.lists=[response];
                    user.inventory_id = response.id;
                    callback(null, user);
                });
            } else {
                callback(null, user);
            }
        });
    });
};

Account.team = function(user, newTeam, callback){
    pg.connect(connection, function(err, client, done) {
        if(err){return callback(err);}
        console.log("PG.Account.team: Connected");


        var now = Date.now();
        var buffer = (crypto.randomBytes(128)).toString('hex'); //fake password for team for inviting other members

        //create team account using the user who created the team and the newTeam info
        var text = 'INSERT INTO accounts(name, passwordhash, type, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        client.query(text, [newTeam.name, buffer, "team", now, now], function(err, result){
            if(err){return callback(err);}
            console.log("PG.Account.team: Team Created");
            console.log(result);
            dbTeam = result.rows[0];

            //update user to reflect team
            var text = "UPDATE accounts SET team_id = $1, updated_at = $2 WHERE id = $3";
            client.query(text, [dbTeam.id, now, user.id], function(err, response){
                if(err){
                    console.log(err);
                    return callback(err);}
                console.log("PG.Account.team: User added to team");

                //Move the inventory to the team
                var text = "UPDATE lists SET account_id = $1 WHERE account_id = $2 AND type = 'inventory'";
                client.query(text, [dbTeam.id, user.id], function(err, response){
                    done();
                    if(err) {
                        console.log(err);
                        return callback({message:"Update error", error: err});
                    }
                    console.log("PG.Account.team: Inventory moved from user to team");


                    //Success!
                    callback(null, newTeam);
                });

            });

            //Move inventory to team
            // List.moveInventory(user, newTeam, function(){});
        });
    });
};

// ----------------------------------------------
// -------------------- READ --------------------
// ----------------------------------------------
Account.login = function(credentials, callback) {
    pg.connect(connection, function(err, client, done) {
        if(err){return {message:"Connection Error:", error: err};}
        console.log("PG.Account.login: Connected");
        console.log(credentials);
        // var hash = bcrypt.hashSync(logIn.password, 8);

        var text = 'SELECT * FROM accounts WHERE name LIKE $1';
        client.query(text, [credentials.username], function(err, result){
            if(err){return callback({message: "Selecct error", error: err});}
            var user = result.rows[0];
            if(!user){return callback({message: "incorrect username"});}
            console.log("PG.Account: User found");

            if(!bcrypt.compareSync(credentials.password, user.passwordhash)){
                done();
                callback({error: "Incorrect password..."});
            } else {
                //Password matches! Now create a token.
                var buffer = (crypto.randomBytes(128)).toString('hex');

                user.token = buffer;

                var text = "UPDATE accounts SET token = $1 WHERE id = $2 ";
                client.query(text, [buffer, result.rows[0].id], function(err, response){
                    done();
                    if (err) {console.log(err);}
                    console.log("PG.Account: Token written");
                });

                List.getAll(user, function(err, response){
                    if(err) return console.log(err);
                    console.log("PG.Account.Login: Lists put on user.");
                    user.lists=response;
                    callback(null, {user: user});
                });


            }
        });
    });
};

Account.findByToken = function(token, callback){
    pg.connect(connection, function(err, client, done){
        if(err){return callback({message: "Connection Error:", error: err});}
        console.log("PG.Account.findByToken: Connection");

        var text = 'SELECT * FROM accounts WHERE token LIKE $1';
        client.query(text, [token.toString('hex')], function(err, result){
            done();
            if(err){return callback({message: "Token not found", error: err});}
            console.log("PG.Account: User found by Token");
            var user = result.rows[0];
            console.log("findByToken user:", user);
            //Get all their lists
            if(user){
                List.getAll(user, function(err, response){
                    user.lists = response;
                    response.map(function(item){
                        if(item.type==="inventory"){
                            user.inventory_id = item.id;
                        }
                    });
                    callback(null, user);
                });
            } else {
                callback({message: "No user found"});
            }
        });
    });
};
Account.findById = function(id, callback){
    pg.connect(connection, function(err, client, done){
        if(err){return callback({message: "Connection Error:", error: err});}
        console.log("PG.Account.findById: Connection");

        var text = 'SELECT * FROM accounts WHERE id = $1';
        client.query(text, [id], function(err, result){
            done();
            if(err){return callback({message: "ID not found", error: err});}
            console.log("PG.Account.findById: Account found");
            var user = result.rows[0];
            callback(null, user);
        });
    });
};
Account.teammates = function(team_id, callback) {
    pg.connect(connection, function(err, client, done){
        if(err){return callback({message: "Connection Error:", error: err});}
        console.log("PG.Account.teammates: Connection");

        var text = 'SELECT * FROM accounts WHERE team_id = $1';
        client.query(text, [team_id], function(err, result){
            done();
            if(err) callback({message: "team not found", error: err});
            console.log("PG.Account.teammates: Team Found");
            var users = result.rows;
            callback(null, users);
        });
    });
};

// ------------------------------------------------
// -------------------- UPDATE --------------------
// ------------------------------------------------
Account.update = function(account, edited, callback){
    pg.connect(connection, function(err, client, done){
        if(err){return callback({message: "Connection Error:", error: err});}
        console.log("PG.Account.update: Connected");

        var now = Date.now();
        var text = "UPDATE accounts SET name = $2, type = $3, updated_at = $4 WHERE id = $1 ";
        client.query(text, [account.id, edited.name, edited.type, now], function(err, response){
            done();
            if (err) {console.log(err);}
            console.log("PG.Account: User updated");
            callback(null, {user: response.rows[0]});
        });
    });
};

// -------------------------------------------------
// -------------------- DESTROY --------------------
// -------------------------------------------------
Account.delete = function (account_id, callback) {
    pg.connect(connection, function(err, client, done) {
        if(err){return callback({message: "Connection Error:", error: err});}
        console.log("PG.Account.delete: Connected");

        client.query('DELETE FROM accounts WHERE id = $1', [account_id], function(err, response){
            done();
            if(err) {
                console.log('\nError:\n', err);
                return callback({error: err});
            }

            console.log("PG.Account.delete: Successful delete.");
            callback(null, {message: "Account is deleted", response: response});
        });
    });
};


// ----------------------------------------------
// -------------------- LIST --------------------
// ----------------------------------------------
Account.lists = function(account) {
    console.log("Account.lists...");
    List.getAll(account, function(response){
        return response;
    });
};

module.exports = Account;

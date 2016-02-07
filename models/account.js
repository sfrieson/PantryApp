var pg = require('pg');
var connection = "postgres://localhost/pantryapp";

var bcrypt = require('bcryptjs');
var crypto = require('crypto');

var Account = {};

Account.team = function(user, newTeam, callback){
    pg.connect(connection, function(err, client, done) {
        if(err){return callback(err);}
        console.log("PG: Connected");

        var now = Date.now();
        var hash = bcrypt.hashSync(newAcct.password, 8); //fake password for team for inviting other members

        //create team account
        var text = 'INSERT INTO accounts(name, passwordhash, type, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        client.query(text, [newTeam.name, hash, "team", now, now], function(err, result){
            if(err){return callback(err);}
            console.log("PG: User Created");
            newTeam = result.rows[0];

            //update user to reflect team
            var text = "UPDATE accounts SET team_id = $1, updated_at = $2 WHERE id = $3";
            client.query(text, [newTeam.id, now, user.id], function(err, response){
                done();
                if (err) {console.log(err);}
                console.log("PG: Token written");
            });
            //Success!
            callback(null, newTeam);
        });
    });
};

Account.new = function(newAcct, callback) {
    pg.connect(connection, function(err, client, done) {
        if(err){return callback(err);}
        console.log("PG: Connected");

        var now = Date.now();
        var buffer = (crypto.randomBytes(128)).toString('hex');

        var text = 'INSERT INTO accounts(name, passwordhash, type, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        client.query(text, [newAcct.username, buffer, "user", now, now], function(err, result){
            if(err){return callback(err);}
            console.log("PG: User Created");
            callback(null, result.rows[0]);
        });
    });
};

Account.login = function(credentials, callback) {
    pg.connect(connection, function(err, client, done) {
        if(err){return {message:"Connection Error:", error: err};}
        console.log("PG: Connected");

        // var hash = bcrypt.hashSync(logIn.password, 8);

        var text = 'SELECT * FROM accounts WHERE name LIKE $1';
        client.query(text, [credentials.username], function(err, result){
            if(err){return callback({message: "incorrect username", error: err});}
            console.log("PG: User found");
            var user = result.rows[0];


            if(bcrypt.compareSync(credentials.password, user.passwordhash)){
                //Password matches! Now create a token.
                var buffer = (crypto.randomBytes(128)).toString('hex');

                result.rows[0].token = buffer;

                var text = "UPDATE accounts SET token = $1 WHERE id = $2 ";
                client.query(text, [buffer, result.rows[0].id], function(err, response){
                    done();
                    if (err) {console.log(err);}
                    console.log("PG: Token written");
                });
                callback(null, {user: result.rows[0]});
            } else {
                done();
                callback({error: "Incorrect password..."});
            }
        });
    });
};

Account.findByToken = function(token, callback){
    pg.connect(connection, function(err, client, done){
        console.log("PG: Connection");

        var text = 'SELECT * FROM accounts WHERE token LIKE $1';
        client.query(text, [token.toString('hex')], function(err, result){
            done();
            if(err){return callback({message: "Token not found", error: err});}
            console.log("PG: User found by Token");
            var user = result.rows[0];
            callback(null, user);
        });
    });
};

Account.update = function(id, edited, callback){
    pg.connect(connection, function(err, client, done){
        if(err){callback({message: "Connection Error:", error: err});}
        console.log("PG: Connected");

        var now = Date.now();
        var text = "UPDATE accounts SET name = $2, type = $3, updated_at = $4 WHERE id = $1 ";
        client.query(text, [id, edited.name, edited.type, now], function(err, response){
            done();
            if (err) {console.log(err);}
            console.log("PG: User updated");
            callback(null, {user: response.rows[0]});
        });
    });
};

Account.delete = function (account, callback) {
    pg.connect(connection, function(err, client, done) {
        if(err){callback({message: "Connection Error:", error: err});}
        console.log("PG: Connected");

        client.query('DELETE FROM accounts WHERE id = $1', [account.id], function(err, response){
            done();
            if(err) callback({error: err});
            callback(null, {message: "User" + account.name + "is deleted", response: response});
        });
    });
};

module.exports = Account;

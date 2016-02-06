var pg = require('pg');
var connection = "postgres://localhost/pantryapp";

var bcrypt = require('bcryptjs');
var crypto = require('crypto');

var Account = {};

Account.new = function(newAcct, callback) {
    pg.connect(connection, function(err, client, done) {
        if(err){return callback(err);}
        console.log("PG: Connected");

        var now = (new Date()).getTime();
        var hash = bcrypt.hashSync(newAcct.password, 8);

        var text = 'INSERT INTO accounts(name, passwordhash, created_at, updated_at) VALUES ($1, $2, $3, $4)';
        client.query(text, [newAcct.username, hash, now, now], function(err, result){
            if(err){return callback(err);}
            console.log("PG: User Created");

            var text = "SELECT * FROM accounts ORDER BY created_at DESC LIMIT 1";
            client.query(text, function(error, response){
                done();
                if(error){return callback(error);}

                //Success!
                callback(null, response.rows[0]);
            });
        });
    });
};

Account.login = function(credentials, callback) {
    pg.connect(connection, function(err, client, done) {
        if(err){return res.send("Connection Error:", err);}
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
                callback(null, {user: result.rows[0]});
                var text = "UPDATE accounts SET token = $1 WHERE id = $2 ";
                client.query(text, [buffer, result.rows[0].id], function(err, response){
                    done();
                    if (err) {console.log(err);}
                    console.log("PG: Token written");

                });
            } else {
                done();
                callback({error: "Incorrect password..."});
            }
        });
    });
};

Account.delete = function (account) {
    pg.connect(connection, function(err, client, done) {
        if(err){return res.send("Connection Error:", err);}
        console.log("PG: Connected");

        client.query('DELETE FROM accounts WHERE id = $1', [req.user.id], function(err, response){
            done();
            if(err) return res.json({error: err});
            res.json({message: "User" + req.name + "is deleted", response: response});
        });
    });
};

module.exports = Account;

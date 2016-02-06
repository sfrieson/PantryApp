var express = require('express');
var index = express.Router();

var pg = require('pg');
var connection = "postgres://localhost/pantryapp";

var bcrypt = require('bcryptjs');

index.get('/', function(req, res){
    res.render("../templates/index");
});
index.post('/signup', function(req, res){

    pg.connect(connection, function(err, client, done) {
        if(err){return res.send("Connection Error:", err);}
        console.log("PG Connected");

        var newAcct = req.body.account;
        var now = new Date();
        var hash = bcrypt.hashSync(newAcct.password, 8);

        var text = 'INSERT INTO accounts(name, passwordhash, created_at, updated_at) VALUES ($1, $2, $3, $4)';
        client.query(text, [newAcct.username, hash, now, now], function(err, result){
            if(err){return res.send("INSERT Error:", err);}

            var text = "SELECT * FROM accounts ORDER BY created_at DESC LIMIT 1";
            client.query(text, function(error, response){
                done();
                if(error){return res.send("SELECT Error:", error);}

                res.send("Query Response:", response.rows[0]);
            });
        });
    });
});
index.post('/login', function(req,res){
    pg.connect(connection, function(err, client, done) {
        if(err){return res.send("Connection Error:", err);}
        console.log("PG Connected");

        var logIn = req.body.account;
        // var hash = bcrypt.hashSync(logIn.password, 8);

        var text = 'SELECT * FROM accounts WHERE name LIKE $1';
        client.query(text, [logIn.username], function(err, result){
            done();
            if(err){return res.send("INSERT Error:", err);}
            var user = result.rows[0];

            if(bcrypt.compareSync(logIn.password, user.passwordhash)){
                res.json({user: result.rows[0]});
            } else {
                res.send("Wrong password...");
            }
        });
    });
});
module.exports = index;

var express = require('express');
var index = express.Router();
var Account = require('../models/account');
var publicDir = "/Users/sfrieson/code/wdi/PantryApp/public";

index.get('/', function(req, res){
    console.log(__dirname);
    res.sendFile(publicDir + "/views/index.html");
});
index.post('/signup', function(req, res){
    Account.new(req.body.account, function(err, account){
        if(err) console.log(err);
        res.json({"new user": account});
    });
});

index.post('/login', function(req,res){
    console.log(req.body);
    Account.login(req.body.account, function(err, account){
        if(err) console.log(err);
        res.json({user: account});
    });
});
module.exports = index;

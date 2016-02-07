var express = require('express');
var index = express.Router();
var Account = require('../models/account');
var publicDir = "/Users/sfrieson/code/wdi/PantryApp/public";

index.get('/', function(req, res){
    // res.sendFile(publicDir + "/views/index.html");
    res.render("../views/index", {user: req.user});
});
index.post('/signup', function(req, res){
    Account.new(req.body.account, function(err, account){
        if(err) res.json({error: err});
        res.json({"new user": account});
    });
});

index.post('/login', function(req,res){
    Account.login(req.body.account, function(err, user){
        if(err) console.log(err);
        res.json(user);
    });
});

module.exports = index;

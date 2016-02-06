var express = require('express');
var index = express.Router();
var Account = require('../models/account');


index.get('/', function(req, res){
    res.render("../templates/index");
});
index.post('/signup', function(req, res){
    Account.new(req.body.account, function(err, account){
        if(err) console.log(err);
        res.json({"new user": account});
    });
});

index.post('/login', function(req,res){
    Account.login(req.body.account, function(err, account){
        if(err) console.log(err);
        res.json({user: account});
    });
});
module.exports = index;

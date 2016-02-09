var express = require('express');
var router = express.Router();
var Account = require('../models/account');

router.get('/', function(req, res){
        res.sendFile("views/index.html", {root: "./public"});
});

router.post('/signup', function(req, res){
    Account.new(req.body.account, function(err, account){
        if(err) res.json({error: err});
        res.json({"new user": account});
    });
});

router.post('/login', function(req,res){
    Account.login(req.body.user, function(err, user){
        if(err) console.log(err);
        res.json(user);
    });
});

router.get('/token/:token', function(req,res){
    Account.findByToken(req.params.token, function(err, user){
        if(err) console.log(err);
        res.json(user);
    });
});

module.exports = router;

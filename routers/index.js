var express = require('express');
var router = express.Router();
var Account = require('../models/account');

router.get('/', function(req, res){
    res.sendFile("views/index.html", {root: "./public"});
});

router.get('/join-team', function(req, res){
    res.cookie('pantry_app_team', req.query.token);
    res.sendFile("views/join-team.html", {root: "./public"});
});

router.post('/signup', function(req, res){
    //add directly to team if there is the proper cookie.
    req.body.account.team_id = req.cookies.pantry_app_team || null;
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

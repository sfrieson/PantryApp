var express = require('express');
var router = express.Router();
var Account = require('../models/account');

router.get('/team', function(req, res){
    Account.findById(req.user.team_id, function(err, response){
        res.json(err || response);
    });
});
router.post('/team', function(req, res){
    var currentUser = req.user;
    var newTeam = req.body;
    console.log(currentUser);
    console.log(newTeam);
    Account.team(currentUser, newTeam, function(err, response){
        res.json(err || response);
    });
});

router.delete('/:id', function(req, res){
    console.log("==================req.params.id:", req.params.id);
    Account.delete(req.params.id, function(err, response){
        if(err) {return res.json({error: err});}
        res.json(response);
    });
});



module.exports = router;

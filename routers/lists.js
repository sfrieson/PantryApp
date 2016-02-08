var express = require('express');
var router = express.Router();
var List = require('../models/list');
var publicDir = "/Users/sfrieson/code/wdi/PantryApp/public";

router.get('/', function(req,res){
    List.getAll(req.user, function(err, response){
        res.json({lists:response});
    });
});
router.get('/:id', function(req,res){
    List.get(req.params.id, function(err, response){
        res.json({list:response});
    });
});
router.post('/', function(req, res){
    List.new(req.user, req.body.list, function(err, response){
        res.json({list:response});
    });
});
router.post('/item', function(req, res){
    List.addItem(req.body.list, req.body.listItem, function(err, response){
        if (err) {
            console.log({error: err});
        }
        res.json({item:response});
    });
});

module.exports = router;

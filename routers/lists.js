var express = require('express');
var router = express.Router();
var List = require('../models/list');
var ListItem = require('../models/listitem');
var publicDir = "/Users/sfrieson/code/wdi/PantryApp/public";

// ------------------------------------------------
// -------------------- CREATE --------------------
// ------------------------------------------------
router.post('/', function(req, res){
    List.new(req.body.list, function(err, response){
        res.json({list:response});
    });
});

router.post('/items', function(req, res){
    List.addItem(req.body.list, req.body.listItem, function(err, response){
        if (err) {
            console.log({error: err});
        }
        res.json(response);
    });
});

// ----------------------------------------------
// -------------------- READ --------------------
// ----------------------------------------------
router.get('/', function(req,res){
    List.getAll(req.user, function(err, response){
        res.json({lists:response});
    });
});
router.get('/:id', function(req,res){
    List.get(req.params.id, function(err, response){
        res.json(response);
    });
});
router.get('/items/find', function(req,res){
    ListItem.findFood(req.query.name, function(err, response){
        if (err) {
            return res.json({error: err});
        }
        res.json(response);
    });
});
router.get('/items/nutrition', function(req,res){
    ListItem.nutrition(req.query.ndb_no, function(err, response){
        if (err) {
            return res.json({error: err});
        }
        res.json(response);
    });
});

//find alternative to using post.
//Need array in request
router.post('/items/nutrition', function(req,res){
    ListItem.nutrition(req.body.ndb_no, function(err, response){
        if (err) {
            console.log(err);
            return res.json({error: err});
        }
        res.json(response);
    });
});

// ------------------------------------------------
// -------------------- UPDATE --------------------
// ------------------------------------------------
router.patch('/items', function(req,res){
    ListItem.edit(req.body.item, function(err, response){
        if (err) {
            return console.log({error: err});
        }
        res.json(response);
    });
});
router.patch('/items/move-all', function(req, res){
    ListItem.switchList(req.body.targetList, req.body.itemsArr, function(err, response){
        if (err) {
            console.log({error: err});
        }
        res.json(response);
    });
});
// -------------------------------------------------
// -------------------- DESTROY --------------------
// -------------------------------------------------
router.delete('/:id', function(req,res){
    List.delete(req.params.id, function(err, response){
        res.json(response);
    });
});
router.delete('/items/:id', function(req,res){
    console.log("Deleting");
    ListItem.delete(req.params.id, function(err, response){
        if(err) console.log(err);
        res.json({list:response});
    });
});








module.exports = router;

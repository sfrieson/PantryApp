var express = require('express');
var index = express.Router();

index.get('/', function(req, res){
    res.send("Hello, world!");
});

module.exports = index;

// ======================= BASELINE =======================
var express = require('express');
var app = express();

//connect pg?
// var pg = require('pg-native');


// ======================= MIDDLEWARES =======================
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var dotenv = require('dotenv');

// Middleware for checking user is logged in before viewing page.

app.use(morgan('dev'));
app.set(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());


// ======================= ROUTING =======================
var index = require('./routers/index');
app.use('/', index);



// ======================= LISTENING =======================
port = process.env.PORT || 8080;
app.listen(port,  function(){console.log("Listening on", port);}   );

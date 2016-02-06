// ======================= BASELINE =======================
var express = require('express'),
    app = express();

//connect pg?
// var pg = require('pg-native');


// ======================= MIDDLEWARES =======================
var morgan          = require('morgan'),
    bodyParser      = require('body-parser'),
    cookieParser    = require('cookie-parser'),
    dotenv          = require('dotenv'),
    // ejs             = require('ejs'),
    loadUser        = require('./middlewares/loaduser');

// Middleware for checking user is logged in before viewing page.

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(loadUser);
app.use(express.static("./public/"));

// ======================= ROUTING =======================
var index = require('./routers/index');

app.use('/', index);



// ======================= LISTENING =======================
port = process.env.PORT || 8080;
app.listen(port,  function(){console.log("Listening on", port);}   );

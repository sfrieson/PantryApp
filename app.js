// ======================= BASELINE =======================
var express = require('express'),
    app = express();




// ======================= MIDDLEWARES =======================
var morgan          = require('morgan'),
    bodyParser      = require('body-parser'),
    cookieParser    = require('cookie-parser'),
    dotenv          = require('dotenv'),
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
var lists = require('./routers/lists');
var accounts = require('./routers/accounts');

app.use('/', index);
app.use('/lists', lists);
app.use('/accounts', accounts);




// ======================= LISTENING =======================
require('dotenv').config();

port = process.env.PORT;
app.listen(port,  function(){console.log("Listening on", port);}   );

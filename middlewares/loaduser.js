var Account = require('../models/account');

var loadUser = function(req, res, next){
    var token = req.cookies.pantry_app_t;
    console.log("loadUser, token:", token);
    if (token) {
        Account.findByToken(token, function(err, user){
            if(err) return next();
            req.user = user;
            next();
        });
    }else { next();}
};
module.exports = loadUser;

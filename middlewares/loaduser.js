var Account = require('../models/account');

var loadUser = function(req, res, next){
    var token = req.cookies.pantry_app_t;
    if (token) {
        Account.findByToken(token, function(err, user){
            req.user = user;
            next();
        });
    }else { next();}
};
module.exports = loadUser;

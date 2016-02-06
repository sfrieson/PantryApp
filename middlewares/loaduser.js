var Account = require('../models/account');

var loadUser = function(req, res, next){
    if (req.cookies.pantryToken) {
        Account.findByToken(req.cookies.token, function(user){
            req.user = user;
        });
    }
    next();
};
module.exports = loadUser;

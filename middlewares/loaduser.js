var Account = require('../models/account');

var loadUser = function(req, res, next){
    if (req.cookies.pantry_app) {
        Account.findByToken(req.cookies.pantry_app, function(err, user){
            req.user = user;
            console.log("Here's your token, sir...", req.cookies.pantry_app);
            next();
        });
    }else { next();}



};
module.exports = loadUser;

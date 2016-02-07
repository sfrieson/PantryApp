var pg = require('pg');
var connection = "postgres://localhost/pantryapp";

var List = {};
var ListItem = require("./listitem.js");

// ------------------------------------------------
// -------------------- CREATE --------------------
// ------------------------------------------------
List.new = function(account, list, callback, type){
    pg.connect(connection, function(err, client, done){
        if(err) return callback({message:"Connection error", error: err});
        console.log("PG.List: Connected");

        var now = Date.now();
        type = type || "list";

        var text="INSERT INTO lists (account_id, team_id, name, description, type, created_at, updated_at) " +
        "VALUES $1, $2, $3, $4, $5, $6, $7 RETURNING *";
        var values = [account.id, account.team, list.name, list.desc, type, now, now];
        client.query(text, values, function(err, response){
            done();
            if(err) return callback({message:"Insert error", error: err});

            callback(null, response.rows[0]);
        });
    });
};
List.newInventory = function(account, callback){
    var list = {
        name: "Inventory",
        desc: "Everything that you currently own."
    };
    var type = "inventory";
    List.new(account, list, callback, type);
};
// ----------------------------------------------
// -------------------- READ --------------------
// ----------------------------------------------
List.getAll = function(account, callback){
    pg.connect(connection, function(err, client, done){
        if(err) return callback({message:"Connection error", error: err});
        console.log("PG.List: Connected");

        var text = "SELECT * FROM lists WHERE account_id = $1";
        client.query(text, [account.id], function(err, result){
            done();
            if (err) return callback({message:"Select error", error: err});
            callback(null, result.rows);
        });
    });
};
List.getOne = function(list, callback){
    pg.connect(connection, function(err, client, done){
        if(err) return callback({message:"Connection error", error: err});
        console.log("PG.List: Connected");

        var text = "SELECT * FROM lists WHERE id = $1";
        client.query(text, [list.id], function(err, result){
            done();
            if (err) return callback({message:"Select error", error: err});
            callback(null, result.rows[0]);
        });
    });
};
List.getInventory = function(user, callback){
    pg.connect(connection, function (err, client, done) {
        if(err) return callback({message:"Connection error", error: err});
        console.log("PG.List: Connected");

        var text = "SELECT * FROM lists WHERE id = $1, type LIKE 'inventory'";
        client.query(text, [user.id], function(err, result){
            done();
            if(err)return callback({message:"Select error", error: err});
            callback(null, result.rows[0]);
        });
    });
};

// ------------------------------------------------
// -------------------- UPDATE --------------------
// ------------------------------------------------
List.update = function(list, callback){
};

List.changeOwner = function(list, newOwner, callback){
    pg.connect(connection, function (err, client, done) {
        if(err) return callback({message:"Connection error", error: err});
        console.log("PG.List: Connected");

        var text = "UPDATE lists WHERE id= $1 SET id = $2 '";
        client.query(text, [list.id, newOwner.id], function(err){
            done();
            if(err) return callback({message:"Select error", error: err});
            callback(null, {message:"successful"});
        });
    });
};

List.moveInventory = function (currentOwner, newOwner, callback){
    pg.connect(connection, function (err, client, done) {
        if(err) return callback({message:"Connection error", error: err});
        console.log("PG.List: Connected");

        var text = "UPDATE lists WHERE account_id= $1, type LIKE 'inventory' SET id = $2 '";
        client.query(text, [currentOwner.id, newOwner.id], function(err){
            done();
            if(err) return callback({message:"Select error", error: err});
            callback(null, {message:"successful"});
        });
    });
};




// -------------------------------------------------
// -------------------- DESTROY --------------------
// -------------------------------------------------
List.delete = function (list, callback) {
    pg.connect(connection, function(err, client, done) {
        if(err){callback({message: "Connection Error:", error: err});}
        console.log("PG.List: Connected");

        client.query('DELETE FROM lists WHERE id = $1', [list.id], function(err, response){
            done();
            if(err) callback({error: err});
            callback(null, {message: "List" + list.name + "is deleted", response: response});
        });
    });
};

// ----------------------------------------------------
// -------------------- LIST ITEMS --------------------
// ----------------------------------------------------
List.addItem = function(list, item, callback) {
    ListItem.add(list, item, function(err, response){

    });
};

List.addItems = function(list, itemArr, callback) {
    var rollback = function(client, done) {
        client.query('ROLLBACK', function(err) {
            //If there's an error, rollback.
            callback(err);
            return done(err);
        });
    };

    //to be called recursively until array is up.
    var i=0;
    var responseArr = [];
    var query = function query (client) {
        ListItem.add(list, itemArr[i], function(err, response){
            if(err) return rollback(client, done);
            responseArr.push(response);
            i++;
            if(i <= itemArr.length){
                query(client);
            } else {
                //Done working;
                client.query('COMMIT', done);
                callback(null, responseArr);
            }
        });
    };

    pg.connect(function(err, client, done) {
        if(err) throw err;
        console.log("PG.List: Connected");

        client.query('BEGIN', function(err) {
            if(err) return rollback(client, done);
            process.nextTick(function() {
                query(client);
            });
        });
    });
};

module.exports = List;
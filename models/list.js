var pg = require('pg');

require('dotenv').config();
var connection = process.env.PGCONNECT;


var List = {};
var ListItem = require("./listitem.js");

// ------------------------------------------------
// -------------------- CREATE --------------------
// ------------------------------------------------
List.new = function(list, callback, type){
    pg.connect(connection, function(err, client, done){
        if(err) return callback({message:"Connection error", error: err});
        console.log("PG.List.new: Connected");

        var now = Date.now();
        type = type || "list";
        console.log('list account id', list.account_id);
        var text="INSERT INTO lists (account_id, name, description, type, created_at, updated_at) " +
        "VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
        var values = [list.account_id, list.name, list.desc, type, now, now];
        client.query(text, values, function(err, response){
            done();
            if(err){
                console.log(err);
                return callback({message:"Insert error", error: err});
            }
            console.log("PG.List.new: List added.");
            callback(null, response.rows[0]);
        });
    });
};
List.newInventory = function(account, callback){
    console.log("PG.List.newInventory.....");
    var list = {
        name: "Inventory",
        desc: "Everything that you currently own.",
        account_id: account.id
    };
    var type = "inventory";
    List.new(list, callback, type);
};
// ----------------------------------------------
// -------------------- READ --------------------
// ----------------------------------------------
List.getAll = function(account, callback){
    pg.connect(connection, function(err, client, done){
        if(err) return callback({message:"Connection error", error: err});
        console.log("PG.List.getAll: Connected");

        var text = "SELECT * FROM lists WHERE account_id = $1";
        var data = [account.id];
        if(account.team_id){ //if the user has a team add on to the query
            text += " OR account_id = $2";
            data.push(account.team_id);
        }
        client.query(text, data, function(err, result){
            if (err) return callback({message:"Select error", error: err});
            done();
            console.log("PG.List.getAll: All selected");
            return callback(null, result.rows);

        });
    });
};
List.get = function(list_id, callback){
    pg.connect(connection, function(err, client, done){
        if(err) return callback({message:"Connection error", error: err});
        console.log("PG.List.getOne: Connected");

        var text = "SELECT * FROM lists WHERE id = $1";
        client.query(text, [list_id], function(err, result){
            done();
            if (err) return callback({message:"Select error", error: err});
            console.log("PG.List.getOne: Selected List");
            var list = result.rows[0];
            ListItem.get(list, function(err, result){
                console.log("List.getOne calling ListItem.get...");
                list.items = result;
                callback(null, list);
            });
        });
    });
};
List.getInventory = function(user, callback){
    pg.connect(connection, function (err, client, done) {
        if(err) return callback({message:"Connection error", error: err});
        console.log("PG.List.getInventory: Connected");

        var text = "SELECT * FROM lists WHERE id = $1, type LIKE 'inventory'";
        client.query(text, [user.id], function(err, result){
            done();
            if(err)return callback({message:"Select error", error: err});
            console.log("PG.List.getInventory: Selected Inventory");
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
        console.log("PG.List.changeOwner: Connected");

        var text = "UPDATE lists WHERE id= $1 SET id = $2 '";
        client.query(text, [list.id, newOwner.id], function(err){
            done();
            if(err) return callback({message:"Update error", error: err});
            console.log("PG.List.changeOwner: Owner changed");
            callback(null, {message:"successful"});
        });
    });
};

List.moveInventory = function (currentOwner, newOwner, callback){
    pg.connect(connection, function (err, client, done) {
        if(err) return callback({message:"Connection error", error: err});
        console.log("PG.List.moveInventory: Connected");

        var text = "UPDATE lists WHERE account_id= $1, type = 'inventory' SET id = $2 '";
        client.query(text, [currentOwner.id, newOwner.id], function(err){
            done();
            if(err) return callback({message:"Update error", error: err});
            console.log("PG.List.moveInventory: Inventory moved");
            callback(null, {message:"successful"});
        });
    });
};




// -------------------------------------------------
// -------------------- DESTROY --------------------
// -------------------------------------------------
List.delete = function (list_id, callback) {
    pg.connect(connection, function(err, client, done) {
        if(err){callback({message: "Connection Error:", error: err});}
        console.log("PG.List.delete: Connected");

        client.query('DELETE FROM lists WHERE id = $1', [list_id], function(err, response){
            done();
            if(err) callback({message: "delete error", error: err});
            console.log("PG.List.delete: List deleted");
            callback(null, {message: "List is deleted", response: response});
        });
    });
};

// ----------------------------------------------------
// -------------------- LIST ITEMS --------------------
// ----------------------------------------------------
List.getItems = function(list_id, callback) {
    pg.connect(connection, function(err, client, done) {
        if(err){callback({message: "Connection Error:", error: err});}
        console.log("PG.List.getItems: Connected");

        var text = "WITH all_items AS (" +
            "SELECT list_id, name, notes, status, qty FROM list_items" +
        ")" +
        "SELECT * FROM all_items WHERE list_id = $1;";
        client.query(text, [list_id], function(err, response){
            done();
            if(err) callback({message: "Select error", error: err});
            console.log("PG.List.getItems: All items Selected");
            callback(null, {message: "List" + list.name + "is deleted", response: response});
        });
    });
};

List.addItem = function(list, item, callback) {
    ListItem.add(list, item, function(err, response){
        callback(err, response);
    });
};

ListItem.switchList = function(targetList_id, itemArr, callback) {
    var rollback = function(client, done) {
        client.query('ROLLBACK', function(err) {
            //If there's an error, rollback.
            console.log("ROLLBACK ROLLBACK ROLLBACK ROLLBACK ROLLBACK ROLLBACK");
            callback(err);
            return done(err);
        });
    };

    //to be called recursively until array is up.
    var i=0;
    var responseArr = [];
    var query = function query (client, done) {
        console.log("\nTarget list:\n", targetList_id, "\nitemArr:\n", itemArr, "\ni:\n", i, "\nitemArr[i]\n", itemArr[i]);
        var text = "UPDATE list_items SET list_id = $1 WHERE id = $2";
        var data = [targetList_id, itemArr[i].id];
        client.query(text, data, function(err, response){
            if(err){
                console.log("\nRecursive switching, iteration " + i + ". Error:\n", err);
                return rollback(client, done);
            }
            responseArr.push(response);

            i++;
            if(i < itemArr.length){
                query(client);
            } else {
                //Done working;
                client.query('COMMIT', done);
                return callback(null, responseArr);
            }
        });
    };

    pg.connect(connection, function(err, client, done) {
        if(err) throw err;
        console.log("PG.ListItem.switchList: Connected");

        client.query('BEGIN', function(err) {
            if(err) return rollback(client, done);
            process.nextTick(function() {
                query(client, done);
            });
        });
    });
};

module.exports = List;

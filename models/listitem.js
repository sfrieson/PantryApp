var pg = require('pg');
var connection = "postgres://localhost/pantryapp";

var ListItem = {};

// ------------------------------------------------
// -------------------- CREATE --------------------
// ------------------------------------------------
ListItem.add = function (list, item, callback) {
    pg.connect(connection, function(err, client, done){
        if(err) return callback({message:"Connection error", error: err});
        console.log("PG.ListItem: Connected");
        var now = Date.now();
        item.status = list.type === "inventory" ? "In inventory." : "Needed";
        item.qty = item.qty || 1;

        var text="INSERT INTO list_items (list_id, name, notes, food_des, status, qty, category, created_at, updated_at) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
        var values = [list.id, item.name, item.notes, null, item.status, item.qty, item.category, now, now];
        client.query(text, values, function(err, response){
            done();
            if(err) return callback({message:"Insert error", error: err});
            console.log("PG.ListItem.add: List item added");

            callback(null, response.rows[0]);
        });
    });
};
// ----------------------------------------------
// -------------------- READ --------------------
// ----------------------------------------------
ListItem.get = function(list, callback){
    pg.connect(connection, function(err, client, done){
        if(err) return callback({message:"Connection error", error: err});
        console.log("PG.ListItem.get: Connected");

        var text = "SELECT * FROM list_items WHERE list_id = $1";
        client.query(text, [list.id], function(err, result){
            done();
            if (err) return callback({message:"Select error", error: err});
            console.log("PG.ListItem: List item selected");
            callback(null, result.rows);
        });
    });
};

// ------------------------------------------------
// -------------------- UPDATE --------------------
// ------------------------------------------------
ListItem.switch = function(item, targetList, callback){
    pg.connect(connection, function (err, client, done) {
        if(err) return callback({message:"Connection error", error: err});
        console.log("PG.ListItem.switchList: Connected");

        var newStatus = targetList.type == "inventory" ? "In inventory." : "Needed";
        var text = "UPDATE list_items WHERE id= $1 SET id= $2, status= $3'";
        client.query(text, [list.id, targetList.id, newStatus], function(err){
            done();
            if(err) return callback({message:"Select error", error: err});
            console.log("PG.ListItem.switchList: Item switched between lists");
            callback(null, {message:"successful"});
        });
    });
};

ListItem.switchList = function(targetList, itemArr, callback) {
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
        console.log("\nTarget list:\n", targetList, "\nitemArr:\n", itemArr, "\ni:\n", i, "\nitemArr[i]\n", itemArr[i]);
        var text = "UPDATE list_items SET list_id = $1 WHERE id = $2";
        var data = [targetList.id, itemArr[i].id];
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
        console.log("PG.List.addItems: Connected");

        client.query('BEGIN', function(err) {
            if(err) return rollback(client, done);
            process.nextTick(function() {
                query(client, done);
            });
        });
    });
};

// -------------------------------------------------
// -------------------- DESTROY --------------------
// -------------------------------------------------
ListItem.delete = function (listItem_id, callback) {
    pg.connect(connection, function(err, client, done) {
        if(err){callback({message: "Connection Error:", error: err});}
        console.log("PG.List.delete: Connected");

        client.query('DELETE FROM list_items WHERE id = $1', [listItem_id], function(err, response){
            done();
            if(err) callback({error: err});
            console.log("PG.List.delete: List item deleted");
            callback(null, {message: "List Item is deleted", response: response});
        });
    });
};
module.exports = ListItem;

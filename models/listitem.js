var pg = require('pg');
var connection = "postgres://localhost/pantryapp";

var ListItem = {};

// ------------------------------------------------
// -------------------- CREATE --------------------
// ------------------------------------------------
ListItem.add = function (list, item, callback) {
    pg.connect(connection, function(err, client, done){
        if(err) return callback({message:"Connection error", error: err});
        console.log("PG.ListItems: Connected");
        var now = Date.now();
        item.status = list.type === "inventory" ? "In inventory." : "Needed";
        item.qty = item.qty || 1;

        var text="INSERT INTO list_items (list_id, name, notes, food_des, status, qty, category, created_at, updated_at) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
        var values = [list.id, item.name, item.notes, null, item.status, item.qty, item.category, now, now];
        client.query(text, values, function(err, response){
            done();
            if(err) return callback({message:"Insert error", error: err});

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
        console.log("PG.ListItems: Connected");

        var text = "SELECT * FROM list_items WHERE list_id = $1";
        client.query(text, [list.id], function(err, result){
            done();
            if (err) return callback({message:"Select error", error: err});
            callback(null, result.rows);
        });
    });
};

// ------------------------------------------------
// -------------------- UPDATE --------------------
// ------------------------------------------------
ListItem.switchList = function(item, targetList, callback){
    pg.connect(connection, function (err, client, done) {
        if(err) return callback({message:"Connection error", error: err});
        console.log("PG.ListItem: Connected");

        var newStatus = targetList.type == "inventory" ? "In inventory." : "Needed";
        var text = "UPDATE list_items WHERE id= $1 SET id= $2, status= $3'";
        client.query(text, [list.id, targetList.id, newStatus], function(err){
            done();
            if(err) return callback({message:"Select error", error: err});
            callback(null, {message:"successful"});
        });
    });
};
// -------------------------------------------------
// -------------------- DESTROY --------------------
// -------------------------------------------------
ListItem.delete = function (listItem, callback) {
    pg.connect(connection, function(err, client, done) {
        if(err){callback({message: "Connection Error:", error: err});}
        console.log("PG.List: Connected");

        client.query('DELETE FROM listitemss WHERE id = $1', [listItem.id], function(err, response){
            done();
            if(err) callback({error: err});
            callback(null, {message: "List Item" + listItem.name + "is deleted", response: response});
        });
    });
};
module.exports = ListItem;

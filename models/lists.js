var pg = require('pg');
var connection = "postgres://localhost/pantryapp";

var List = {};

List.inventory = function(user_id, callback){

};
List.changeOwner = function(list_id, new_id, callback){

};
List.new = function(owner_id, list, callback){

};
List.getAll = function(owner_id, callback){

};
list.getOne = function(list_id, callback){

};
List.update = function(list, callback){

};
List.delete = function(list_id, callback){

};
module.exports = List;

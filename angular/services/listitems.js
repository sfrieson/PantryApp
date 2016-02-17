var liFactory = angular.module('ListItemsFactory', []);

liFactory.factory('ListItem', ['$http', function($http){
    var ListItem = {};

    // -------------------- CREATE --------------------

    ListItem.create = function(list, listItem){
        return $http.post('/lists/items', {list:list, listItem: listItem});
    };
    // -------------------- READ --------------------
    ListItem.getList = function(listId){
        return $http.get('/lists/'+listId);
    };
    ListItem.findFood = function(name){
        name = name.split(' ').join('+');
        return $http.get('/lists/items/find?name=' + name);
    };
    ListItem.nutrition = function(ndb_no) {
        if(typeof ndb_no !== "string") {
            return $http.post('/lists/items/nutrition', {ndb_no: ndb_no});
        }
        return $http.get('/lists/items/nutrition?ndb_no=' + ndb_no);
    };
    // -------------------- UPDATE --------------------
    ListItem.edit = function(item){
        return $http.patch('/lists/items', {item: item});
    };
    ListItem.switchList = function(targetList, itemsArr) {
        return $http.patch('/lists/items/move-all', {targetList: targetList, itemsArr: itemsArr});
    };
    // -------------------- DESTROY --------------------
    ListItem.delete = function(listItemId){
        return $http.delete('/lists/items/' + listItemId);
    };
    return ListItem;
}]);

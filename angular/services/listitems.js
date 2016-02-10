var liFactory = angular.module('ListItemsFactory', []);

liFactory.factory('ListItem', ['$http', function($http){
    var ListItem = {};

    ListItem.getList = function(listId){
        return $http.get('/lists/'+listId);
    };

    ListItem.create = function(list, listItem){
        return $http.post('/lists/items', {list:list, listItem: listItem});
    };

    ListItem.delete = function(listItemId){
        return $http.delete('/lists/items/' + listItemId);
    };
    ListItem.switchList = function(targetList, itemsArr) {
        return $http.patch('/lists/items/move-all', {targetList: targetList, itemsArr: itemsArr});
    };
    return ListItem;
}]);

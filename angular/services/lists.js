var listModel = angular.module('listsFactory', []);

listModel.factory('List', ['$http', function($http){
    var List = {};

    List.getList = function (id) {
        id = id || "";
        return $http.get('/lists/'+id);
    };
    List.deleteList = function (id) {
        return $http.delete('/lists/'+id);
    };
    List.addListItem = function (list, listItem ){
        return $http.post('/lists/items', {list: list, listItem: listItem});
    };
    List.deleteListItem = function(id) {
        return $http.delete('/lists/items/' + id);
    };
    List.addList = function(newList) {
        return $http.post('/lists', {list: newList});
    };
    return List;
}]);

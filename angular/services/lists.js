var listModel = angular.module('listsFactory', []);

listModel.factory('List', ['$http', function($http){
    var List = {};

    // ------------- CREATE -------------
    List.add = function(newList) {
        return $http.post('/lists', {list: newList});
    };
    // ------------- READ -------------
    List.getList = function (id) { //All lists on user if no id.
        id = id || "";
        return $http.get('/lists/'+id);
    };
    // ------------- UPDATE -------------
    // ------------- DESTROY -------------
    List.deleteList = function (id) {
        return $http.delete('/lists/'+id);
    };
    // ------------- LIST ITEMS -------------
    List.addListItem = function (list, listItem ){
        return $http.post('/lists/items', {list: list, listItem: listItem});
    };
    List.deleteListItem = function(id) {
        return $http.delete('/lists/items/' + id);
    };
    return List;
}]);

var listCtrl = angular.module("listsController", ['listsFactory']);

listCtrl.controller('ListsController', ['$scope', '$http', 'List', function($scope, $http, List){
    
    List.getList().then(function(response){
        $scope.lists = response.data.lists;
    });
    $scope.getList = function(id){
        List.getList(id).then(function(response){
            $scope.list = response.data.list;
            $scope.list.items = $scope.list.items || [];
        });
    };
    $scope.deleteList = function(id){
        List.deleteList(id).then(function(response){
            console.log(response);
        });
    };
    $scope.addListItem = function(){
        List.addListItem().then(function(response){
            $scope.list.items.push(response.data.item);
        });
    };
    $scope.deleteListItem = function(id){
        List.deleteListItem(id).then(function(response){console.log(response);});
    };
    $scope.addList = function(){
        List.addList().then(function(response){
            $scope.newList = {};
            $scope.lists.push(response.data.list);
        });
    };
}]);

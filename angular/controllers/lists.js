var listCtrl = angular.module("listsController", ['listsFactory']);

listCtrl.controller('ListsController', ['$scope', '$http', "$location", 'List', function($scope, $http, $location, List){
    if (!$scope.user) {
        $location.path('/login');
    }
    // Get all lists when you arrive here.
    List.getList().then(function(response){
        $scope.lists = response.data.lists;
        $scope.user.lists = $scope.lists;
    });

    // ------------- CREATE -------------
    $scope.addList = function(){
        $scope.newList.account_id = $scope.newList.account_id || $scope.user.id;
        List.add($scope.newList).then(function(response){
            $scope.newList = {};
            $scope.lists.push(response.data.list);
            $location.path('/lists');
        });
    };
    // ------------- READ -------------
    $scope.getList = function(id){
        List.getList(id).then(function(response){
            $scope.list = response.data.list;
            $scope.list.items = $scope.list.items || [];
        });
    };
    // ------------- UPDATE -------------
    // ------------- DESTROY -------------

    $scope.deleteList = function(id){
        List.deleteList(id).then(function(response){
            console.log(response);
        });
    };

    // ------------- LIST ITEMS -------------
    $scope.addListItem = function(){
        List.addListItem().then(function(response){
            $scope.list.items.push(response.data.item);
        });
    };
    $scope.deleteListItem = function(id){
        List.deleteListItem(id).then(function(response){console.log(response);});
    };
}]);

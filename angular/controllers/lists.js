var listCtrl = angular.module("listsController", ['listsFactory']);

listCtrl.controller('ListsController', [
    '$rootScope',
    '$scope',
    '$http',
    '$location',
    'List',
    function(
        $rootScope,
        $scope,
        $http,
        $location,

        List){
    if (!$rootScope.user) {
        $location.path('/signup');
    }
    $scope.lists = $rootScope.user.lists;
    // ------------- CREATE -------------
    $scope.addList = function(){
        $scope.newList.account_id = $scope.newList.account_id || $rootScope.user.id;
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
    $scope.clickList = function(list) {
        if(list.type === "inventory") {
            $location.path('/inventory/' + list.id);
        } else {
            $location.path('/lists/' + list.id);
        }
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

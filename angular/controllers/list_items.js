var liCtrl = angular.module('listItemsController', ['ListItemsFactory']);

liCtrl.controller('ListItemsController', ['$scope', '$routeParams', 'ListItem', function($scope, $routeParams, ListItem){
    ListItem.getList($routeParams.id).then(function(response){
        $scope.list = response.data;

    });

    $scope.addListItem = function() {
        ListItem.create($scope.list, $scope.newListItem).then(function(response){
            $scope.list.items.push(response.data);
            $scope.newListItem = {};
        });
    };

    $scope.delete = function(id, index) {
        ListItem.delete(id).then(function(response){
            console.log(response.data);
            $scope.list.items.splice(index, 1);
        });
    };

    $scope.moveToInventory = function() {
        var fakeInventory={id:1};
        ListItem.switchList(fakeInventory, $scope.list.items).then(function(response){
            console.log(response);
        });
    };
}]);

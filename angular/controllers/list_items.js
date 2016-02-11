var liCtrl = angular.module('listItemsController', ['ListItemsFactory']);

liCtrl.controller('ListItemsController', ['$scope', '$routeParams', 'ListItem', function($scope, $routeParams, ListItem){
    if (!$scope.user) {
        $location.path('/login');
    }
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
    $scope.findFood = function(listItem) {
        if(listItem.ndb_no) {
            ListItem.nutrition(listItem.ndb_no).then(function(response){
                $scope.listItem = listItem;
                console.log(response.data);
                $scope.nutrients = response.data;
            });
        } else {
            ListItem.findFood(listItem.name).then(function(response){
                console.log(response);
                $scope.listItem = listItem;
                $scope.results = response.data;
            });
        }
    };
    $scope.saveFood = function(){
        ListItem.edit($scope.listItem).then(function(response){
            console.log("Move along... here's your response:", response);
            $scope.listItem = null;
            $scope.results = null;
        });
    };

    $scope.moveToInventory = function() {
        var fakeInventory={id:1};
        ListItem.switchList(fakeInventory, $scope.list.items).then(function(response){
            console.log(response);
        });
    };
}]);

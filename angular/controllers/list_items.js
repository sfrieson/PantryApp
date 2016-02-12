var liCtrl = angular.module('listItemsController', ['ListItemsFactory', 'listsFactory']);

liCtrl.controller('ListItemsController', [
    '$rootScope',
    '$scope',
    '$routeParams',
    'ListItem',
    'List',

    function(
        $rootScope,
        $scope,
        $routeParams,
        ListItem,
        List){
    if (!$rootScope.user) {
        $location.path('/signup');
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
        var inventory;
        var next = function() {
            ListItem.switchList(inventory, $scope.list.items).then(function(response){
                console.log(response);
            });
        };
        console.log($rootScope.user);
        if(!$rootScope.user.lists){
            List.getList().then(function(response){
                console.log(response);
                $rootScope.user.lists = response.data.lists;
                $rootScope.user.lists.map(function(item){
                    if (item.type === "inventory") inventory = item;
                    next();
                });
            });
        } else {
            $rootScope.user.lists.map(function(item){
                if (item.type === "inventory") inventory = item;
            });
            next();
        }
    };
}]);

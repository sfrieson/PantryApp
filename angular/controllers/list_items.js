var liCtrl = angular.module('listItemsController', ['ListItemsFactory', 'listsFactory']);

liCtrl.controller('ListItemsController', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$mdMedia',
    '$mdDialog',
    'ListItem',
    'List',

    function(
        $rootScope,
        $scope,
        $routeParams,
        $mdMedia,
        $mdDialog,
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
    $scope.findFood = function(e, listItem) {
        var useFullScreen;
        if(listItem.ndb_no) {
            ListItem.nutrition(listItem.ndb_no).then(function(response){
                useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
                $mdDialog.show({
                    controller: 'FoodsController',
                    templateUrl: '/views/partials/nutrients.html',
                    parent: angular.element(document.body),
                    targetEvent: e,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                        listItem: listItem,
                        data: response.data
                    }
                });
            });

        } else {
            var results;
            ListItem.findFood(listItem.name).then(function(response){
                useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
                $mdDialog.show({
                    controller: 'FoodsController',
                    templateUrl: '/views/partials/food-select.html',
                    parent: angular.element(document.body),
                    targetEvent: e,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                        listItem: listItem,
                        data: response.data
                    }
                });
            });
        }
    };


    $scope.moveToInventory = function() {
        ListItem.switchList($rootScope.user.inventory_id, $scope.list.items).then(function(response){
            console.log(response);
        });
    };
}]);

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
    $scope.checked=["applesauce"];
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
    $scope.getTotalNutrition = function(){
        console.log("Calling...");
        console.log($scope.list);
        ListItem.nutrition($scope.list.items).then(function(response){
            $scope.totalNutrition = [];

            //Make object into an array for ng-repeat
            for(var nutrient in response.data.totals) {
                $scope.totalNutrition.push(response.data.totals[nutrient]);
            }
        });
    };
    $scope.movingItems = function() {
        $scope.moving = !$scope.moving;
        if($scope.moving) {
            $scope.userLists = $rootScope.user.lists;
        }
    };
    $scope.moveToInventory = function() {
        $scope.switchList($rootScope.user.inventory_id);
    };
    $scope.switchList = function(id) {
        console.log(id);

        if(id) {
            console.log("moving...");
            ListItem.switchList(id, $scope.list.items).then(function(response){
                console.log(response);
                 $scope.movingItems();
            });
        } else {
            console.log("Delete");
        }
    };
}]);


var app = angular.module('PantryApp', [
    'ngCookies',
    'ngRoute',
    'mainController',
    'accountsController',
    'loginController',
    'listsController',
    'listItemsController',
    'foodsController',
    'ngMaterial'
]);

app.config(['$routeProvider', '$mdThemingProvider', function($routeProvider, $mdThemingProvider) {
    $routeProvider
        .when('/signup', {
            templateUrl: '/views/partials/signup.html',
            controller: 'LoginController'
        })
        .when('/lists', {
            templateUrl: '/views/partials/lists.html',
            controller: 'ListsController'
        })
        .when('/lists/new', {
            templateUrl: '/views/partials/new_list.html',
            controller: 'ListsController'
        })
        .when('/lists/:id', {
            templateUrl: '/views/partials/list.html',
            controller: 'ListItemsController'
        })
        .when('/inventory/:id', {
            templateUrl: '/views/partials/inventory.html',
            controller: 'ListItemsController'
        })
        .when('/team', {
            templateUrl: '/views/partials/team.html',
            controller: 'ListItemsController'
        })
        .when('/join-team', {
            templateUrl: '/views/partials/signup.html',
            controller: 'LoginController'
        })
        .when('/settings', {
            templateUrl: '/views/partials/settings.html',
            controller: 'AccountsController'
        })
        .otherwise({
            redirectTo: '/signup'
        });

    $mdThemingProvider.theme('default')
        .primaryPalette('red')
        .accentPalette('light-green');
}]);

var accountsCtrl = angular.module("accountsController", ['accountService']);

accountsCtrl.controller('AccountsController', [
    '$rootScope',
    '$scope',
    '$location',
    'Account',
    function(
        $rootScope,
        $scope,
        $location,
        Account){

    $scope.createTeam = function() {
        if(!$rootScope.user.team_id){
            Account.createTeam($scope.newTeam).then(function(){
                $location.path('/team');
            });
        }
    };
    $scope.invite = function() {
        $scope.url = "http://localhost:8080/join-team?token=" + $rootScope.user.team_id;
    };
    $scope.removeAccount = function() {
        //saving in variable incase request cycle deletes $rootScope.user while it's updating.
        var user_id = $rootScope.user.id;
        var team_id = $rootScope.user.team_id;
        Account.delete($rootScope.user.id).then(function(response){
            console.log(response);
            $rootScope.setUser(null);
            $location.path('login');
        });
    };
}]);

var foodCtrl = angular.module("foodsController", ['ListItemsFactory']);
foodCtrl.controller("FoodsController", [
    '$scope',
    '$mdDialog',
    'ListItem',
    'listItem',
    'data',
    function(
        $scope,
        $mdDialog,
        ListItem,
        listItem,
        data){
            console.log('li:', listItem);
            $scope.listItem = listItem;
            $scope.data = data;
            $scope.heading = "It's working!";

            $scope.saveFood = function(){
                console.log($scope.nbd_no);
                ListItem.edit($scope.listItem).then(function(response){
                    console.log("Move along... here's your response:", response);
                    $mdDialog.hide();
                });
            };
            $scope.closeModal = function(){
                $mdDialog.hide();
            }
        }]);

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

var ctrl = angular.module("loginController", ['authService']);

ctrl.controller("LoginController", [
    '$rootScope',
    '$scope',
    '$cookies',
    '$location', // ngRoute Paths
    'Auth', //Authorization Factory
    '$mdMedia', //Media Querys
    '$mdDialog', //Modals
    function(
        $rootScope,
        $scope,
        $cookies,
        $location,
        Auth,
        $mdMedia,
        $mdDialog){

    if($rootScope.user){  $location.path('/lists');  }
    $scope.credentials = {};

    $scope.loginModal = function(e) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && true;
        $mdDialog.show({
            controller: 'LoginController',
            templateUrl: '/views/partials/login.html',
            parent: angular.element(document.body),
            targetEvent: e,
            clickOutsideToClose:true,
            fullscreen: useFullScreen
        });
    };

    $scope.login = function() {
        console.log("Logging in with:", $scope.credentials, " to: ", $rootScope.user);

        Auth.login($scope.credentials).then(function (response) {
            $scope.credentials = {};

            if(response.data.user){
            var user = response.data.user;
            console.log("putting cookies");
                $cookies.put('pantry_app_t', user.token);

                $rootScope.setUser(user);
                $location.path('/lists');

                $mdDialog.hide();
            }
        });
    };


}]);

var ctrl = angular.module("mainController", ['accountService']);

ctrl.controller("MainController", ['$rootScope', '$scope', '$location', '$cookies', 'Account',
function($rootScope, $scope, $location, $cookies, Account){
    $rootScope.user = null;
    $rootScope.title = "Pantry App";
    Account.getByToken( $cookies.get('pantry_app_t') ).then(function(response){
        $rootScope.user = response.data;
        console.log($rootScope.user);
    });

    $rootScope.setUser = function(user) {
        $rootScope.user = user;
    };

    $rootScope.logout = function() {
        $cookies.remove('pantry_app_t');
        $rootScope.setUser(null);
        $location.path('/login');
    };

    $rootScope.header="Well, howdy there...";
}]);

var accountService = angular.module("accountService", []);

accountService.factory('Account', ['$http', function($http){
    var Account = {};

    Account.getByToken = function(token){
        return $http.get('/token/' + token);
    };

    Account.createTeam = function(newTeam){
        return $http.post('/accounts/team', {newTeam: newTeam});
    };

    Account.delete = function(account_id) {
        return $http.delete('/accounts/' + account_id);
    };

    Account.teammates = function(team_id) {
        return $http.get('/accounts/teammates/' + team_id);
    };

    return Account;
}]);

var authService = angular.module("authService", ['ngCookies']);

authService.factory('Auth', ['$http', '$cookies', function($http, $cookies){
    var Auth = {};
    
    Auth.login = function (credentials){
        return $http.post('/login', {user: credentials});
    };

    return Auth;
}]);

var liFactory = angular.module('ListItemsFactory', []);

liFactory.factory('ListItem', ['$http', function($http){
    var ListItem = {};

    // -------------------- CREATE --------------------

    ListItem.create = function(list, listItem){
        return $http.post('/lists/items', {list:list, listItem: listItem});
    };
    // -------------------- READ --------------------
    ListItem.getList = function(listId){
        return $http.get('/lists/'+listId);
    };
    ListItem.findFood = function(name){
        name = name.split(' ').join('+');
        return $http.get('/lists/items/find?name=' + name);
    };
    ListItem.nutrition = function(ndb_no) {
        if(typeof ndb_no !== "string") {
            return $http.post('/lists/items/nutrition', {ndb_no: ndb_no});
        }
        return $http.get('/lists/items/nutrition?ndb_no=' + ndb_no);
    };
    // -------------------- UPDATE --------------------
    ListItem.edit = function(item){
        return $http.patch('/lists/items', {item: item});
    };
    ListItem.switchList = function(targetList, itemsArr) {
        return $http.patch('/lists/items/move-all', {targetList: targetList, itemsArr: itemsArr});
    };
    // -------------------- DESTROY --------------------
    ListItem.delete = function(listItemId){
        return $http.delete('/lists/items/' + listItemId);
    };
    return ListItem;
}]);

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

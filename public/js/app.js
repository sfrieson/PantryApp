
var app = angular.module('PantryApp', [
    'ngCookies',
    'ngRoute',
    'mainController',
    'accountsController',
    'loginController',
    'listsController',
    'listItemsController',
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
        .when('/team', {
            templateUrl: '/views/partials/team.html',
            controller: 'ListItemsController'
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
        Account.createTeam($scope.newTeam).then(function(){
            $location.path('/team');
        });
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

var listCtrl = angular.module("listsController", ['listsFactory']);

listCtrl.controller('ListsController', [
    '$rootScope',
    '$scope',
    '$http',
    "$location",
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
    // Get all lists when you arrive here.
    List.getList().then(function(response){
        $scope.lists = response.data.lists;
        $rootScope.user.lists = $scope.lists;
    });

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

var app = angular.module("PantryApp", ['ngCookies', 'ngRoute', 'mainController', 'loginController', "listsController", 'listItemsController']);

app.config(['$routeProvider', function( $routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: '/views/partials/login.html',
            controller: 'LoginController'
        })
        .when('/lists', {
            templateUrl: '/views/partials/lists.html',
            controller: "ListsController"
        })
        .when('/lists/:id', {
            templateUrl: 'views/partials/list.html',
            controller: "ListItemsController"
        })
        .otherwise({
            redirectTo: "/login"
        });
}]);

var liCtrl = angular.module('listItemsController', ['ListItemsFactory']);

liCtrl.controller('ListItemsController', ['$scope', '$routeParams', 'ListItem', function($scope, $routeParams, ListItem){
    ListItem.getList($routeParams.id).then(function(response){
        $scope.list = response.data;

    });

    $scope.addListItem = function() {
        ListItem.create($scope.list, $scope.newListItem).then(function(response){
            $scope.list.items.push(response.data);
        });
    };

    $scope.delete = function(id, index) {
        ListItem.delete(id).then(function(response){
            console.log(response.data);
            $scope.list.items.splice(index, 1);
        });
    };
}]);

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

var ctrl = angular.module("loginController", ['authService']);

ctrl.controller("LoginController", ['$scope', '$cookies', '$location', 'Auth', function($scope, $cookies, $location, Auth){
    $scope.credentials = {};

    $scope.login = function() {
        user = Auth.login($scope.credentials).then(function (response) {
            if(response.data.user){
            var user = response.data.user;
            console.log("putting cookies");
                $cookies.put('pantry_app_t', user.token);
                $cookies.put('pantry_app_id', user.id);

                $scope.setUser(user);
                $location.path('/lists');
            }
        });
    };

    
}]);

var ctrl = angular.module("mainController", ['accountService']);

ctrl.controller("MainController", ['$scope', '$location', '$cookies', 'Account',
function($scope, $location, $cookies, Account){

    Account.getByToken( $cookies.get('pantry_app_t') ).then(function(response){
        $scope.user = response.data;
    });

    $scope.setUser = function(user) {
        $scope.user = user;
    };

    $scope.logout = function() {
        $cookies.remove('pantry_app_t');
        $cookies.remove('pantry_app_id');
        $scope.setUser(null);
        $location.path('/login');
    };
    $scope.header="Well, howdy there...";
}]);

var accountService = angular.module("accountService", []);

accountService.factory('Account', ['$http', function($http){
    var Account = {};

    Account.getByToken = function(token){
        return $http.get('/token/' + token);
    };


    return Account;
}]);

var authService = angular.module("authService", ['ngCookies']);

authService.factory('Auth', ['$http', '$cookies', function($http, $cookies){
    var Auth = {};

    Auth.login = function (credentials){
        return $http.post('/login', {user: credentials})
    };

    return Auth;
}]);

var liFactory = angular.module('ListItemsFactory', []);

liFactory.factory('ListItem', ['$http', function($http){
    var ListItem = {};

    ListItem.getList = function(listId){
        return $http.get('/lists/'+listId);
    };

    ListItem.create = function(list, listItem){
        return $http.post('/lists/items', {list:list, listItem: listItem});
    };

    ListItem.delete = function(listItemId){
        return $http.delete('/lists/items/' + listItemId);
    };
    return ListItem;
}]);

var listModel = angular.module('listsFactory', []);

listModel.factory('List', ['$http', function($http){
    var List = {};

    List.getList = function (id) {
        id = id || "";
        return $http.get('/lists/'+id);
    };
    List.deleteList = function (id) {
        return $http.delete('/lists/'+id);
    };
    List.addListItem = function (list, listItem ){
        return $http.post('/lists/items', {list: list, listItem: listItem});
    };
    List.deleteListItem = function(id) {
        return $http.delete('/lists/items/' + id);
    };
    List.addList = function(newList) {
        return $http.post('/lists', {list: newList});
    };
    return List;
}]);

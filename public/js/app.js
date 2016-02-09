var app = angular.module("PantryApp", ['ngCookies', 'ngRoute', 'mainController', 'loginController', "listsController"]);

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
        .otherwise({
            redirectTo: "/login"
        });
}]);

var listCtrl = angular.module("listsController", ['listsFactory']);

listCtrl.controller('ListsController', ['$scope', '$http', 'List', function($scope, $http, List){

    $scope.getLists = function(){
        List.getList().then(function(response){
            $scope.lists = response.data.lists;
        });
    };
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
        List.addListItem( ).then(function(response){
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



    $scope.getLists();
}]);

var ctrl = angular.module("loginController", ['authService']);

ctrl.controller("LoginController", ['$scope', '$http', 'Auth', function($scope, $http, Auth){
    $scope.credentials = {};

    $scope.login = function() {
        user = Auth.login($scope.credentials);
        $scope.setUser(user);
    };
    $scope.logout = function() {
        $cookies.remove('pantry_app_t');
        $cookies.remove('pantry_app_id');
        $scope.user = null;
    };
}]);

var ctrl = angular.module("mainController", []);

ctrl.controller("MainController", ['$scope', '$http', '$cookies',
function($scope, $http, $cookies){
    var token = $cookies.get('pantry_app_t');
    $http.get('/token/' + token  ).then(function(response){
        $scope.user = response.data;
    });
    $scope.setUser = function(user) {
        $scope.user = user;
    };

    $scope.header="Well, howdy there...";
}]);


var authService = angular.module("authService", ['ngCookies']);

authService.factory('Auth', ['$http', '$cookies', function($http, $cookies){
    var Auth = {};

    Auth.login = function (credentials){
        $http.post('/login', {user: credentials}).then(function (response) {
            console.log("putting cookies");
            var user = response.data.user;
            $cookies.put('pantry_app_t', user.token);
            $cookies.put('pantry_app_id', user.id);

            return user;
        });
    };

    return Auth;
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

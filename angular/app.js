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

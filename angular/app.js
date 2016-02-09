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

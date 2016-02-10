var app = angular.module("PantryApp", ['ngCookies', 'ngRoute', 'mainController', 'accountsController', 'loginController', "listsController", 'listItemsController']);

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
        .when('/lists/new', {
            templateUrl: '/views/partials/new_list.html',
            controller: "ListsController"
        })
        .when('/lists/:id', {
            templateUrl: 'views/partials/list.html',
            controller: "ListItemsController"
        })
        .when('/team', {
            templateUrl: 'views/partials/team.html',
            controller: "ListItemsController"
        })
        .when('/settings', {
            templateUrl: 'views/partials/settings.html',
            controller: "AccountsController"
        })
        .otherwise({
            redirectTo: "/login"
        });
}]);

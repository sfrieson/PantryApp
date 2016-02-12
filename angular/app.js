
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

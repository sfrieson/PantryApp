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

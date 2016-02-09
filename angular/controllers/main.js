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

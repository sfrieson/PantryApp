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

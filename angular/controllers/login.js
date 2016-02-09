var ctrl = angular.module("loginController", ['authService']);

ctrl.controller("LoginController", ['$scope', '$cookies', '$location', 'Auth', function($scope, $cookies, $location, Auth){
    $scope.credentials = {};

    $scope.login = function() {
        user = Auth.login($scope.credentials).then(function (response) {
            $scope.credentials = {};
            
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

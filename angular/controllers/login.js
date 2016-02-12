var ctrl = angular.module("loginController", ['authService']);

ctrl.controller("LoginController", [
    '$rootScope',
    '$scope',
    '$cookies',
    '$location', // ngRoute Paths
    'Auth', //Authorization Factory
    '$mdMedia', //Media Querys
    '$mdDialog', //Modals
    function(
        $rootScope,
        $scope,
        $cookies,
        $location,
        Auth,
        $mdMedia,
        $mdDialog){
    $scope.credentials = {};

    $scope.loginModal = function(e) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && true;
        $mdDialog.show({
            controller: 'LoginController',
            templateUrl: '/views/partials/login.html',
            parent: angular.element(document.body),
            targetEvent: e,
            clickOutsideToClose:true,
            fullscreen: useFullScreen
        });
    };

    $scope.login = function() {
        console.log("Logging in with:", $scope.credentials, " to: ", $rootScope.user);

        Auth.login($scope.credentials).then(function (response) {
            $scope.credentials = {};

            if(response.data.user){
            var user = response.data.user;
            console.log("putting cookies");
                $cookies.put('pantry_app_t', user.token);

                $rootScope.setUser(user);
                $location.path('/lists');

                $mdDialog.hide();
            }
        });
    };


}]);

var app = angular.module("PantryApp", ['ngCookies']);


app.controller("MainController", ['$scope', '$http', '$cookies',
function($scope, $http, $cookies){

    $scope.user = {token: $cookies.get('pantry_app_i'), id: $cookies.get('pantry_app_id')};
    $scope.credentials = {};
    $scope.header="Well, howdy there...";
    $scope.login = function() {
        $http.post('/login', {user: $scope.credentials}).then(function (response) {
            console.log("putting cookies");
            $scope.user = response.data.user;
            var user = response.data.user;
            $cookies.put('pantry_app_t', user.token);
            $cookies.put('pantry_app_id', user.id);
        });
    };


}]);

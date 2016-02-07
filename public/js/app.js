var app = angular.module("PantryApp", ['ngCookies']);


app.controller("MainController", ['$scope', '$http', '$cookies',
function($scope, $http, $cookies){
    $scope.header="Well, howdy there...";
    $scope.login = function() {
        $http.post('/login', {account: $scope.account}).then(function (response) {
            console.log("putting cookies");
            var user = response.data.user;
            $cookies.put('pantry_app', user.token);
        });
    };
}]);

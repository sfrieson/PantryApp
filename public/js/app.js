var app = angular.module("PantryApp", ['ngCookies']);


app.controller("MainController", ['$scope', '$http', '$cookies',
function($scope, $http, $cookies){
    $scope.header="Well, howdy there...";
    $scope.login = function() {
        $http.post('/login', {account: $scope.account}).then(function (token) {
            console.log("putting cookies");
            $cookies.put('pantry_app', token);
        });
    };
}]);

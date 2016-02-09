var ctrl = angular.module("mainController", []);

ctrl.controller("MainController", ['$scope', '$http', '$cookies',
function($scope, $http, $cookies){
    var token = $cookies.get('pantry_app_t');
    $http.get('/token/' + token  ).then(function(response){
        $scope.user = response.data;
    });
    $scope.setUser = function(user) {
        $scope.user = user;
    };

    $scope.header="Well, howdy there...";
}]);

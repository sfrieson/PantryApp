var authService = angular.module("authService", ['ngCookies']);

authService.factory('Auth', ['$http', '$cookies', function($http, $cookies){
    var Auth = {};
    
    Auth.login = function (credentials){
        return $http.post('/login', {user: credentials});
    };

    return Auth;
}]);

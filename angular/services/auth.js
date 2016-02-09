var authService = angular.module("authService", ['ngCookies']);

authService.factory('Auth', ['$http', '$cookies', function($http, $cookies){
    var Auth = {};

    Auth.login = function (credentials){
        $http.post('/login', {user: credentials}).then(function (response) {
            console.log("putting cookies");
            var user = response.data.user;
            $cookies.put('pantry_app_t', user.token);
            $cookies.put('pantry_app_id', user.id);

            return user;
        });
    };

    return Auth;
}]);

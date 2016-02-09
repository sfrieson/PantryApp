var accountService = angular.module("accountService", []);

accountService.factory('Account', ['$http', function($http){
    var Account = {};

    Account.getByToken = function(token){
        return $http.get('/token/' + token);
    };


    return Account;
}]);

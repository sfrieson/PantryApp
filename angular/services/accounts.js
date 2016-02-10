var accountService = angular.module("accountService", []);

accountService.factory('Account', ['$http', function($http){
    var Account = {};

    Account.getByToken = function(token){
        return $http.get('/token/' + token);
    };

    Account.createTeam = function(newTeam){
        return $http.post('/accounts/team', {newTeam: newTeam});
    };

    Account.delete = function(account_id) {
        return $http.delete('/accounts/' + account_id);
    };

    Account.teammates = function(team_id) {
        return $http.get('/accounts/teammates/' + team_id);
    };

    return Account;
}]);

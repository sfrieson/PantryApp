var accountsCtrl = angular.module("accountsController", ['accountService']);

accountsCtrl.controller('AccountsController', [
    '$rootScope', 
    '$scope',
    '$location',
    'Account',
    function(
        $rootScope,
        $scope,
        $location,
        Account){

    $scope.createTeam = function() {
        Account.createTeam($scope.newTeam).then(function(){
            $location.path('/team');
        });
    };
    $scope.invite = function() {
        $scope.url = "http://localhost:8080/join-team?token=" + $rootScope.user.team_id;
    };
    $scope.removeAccount = function() {
        //saving in variable incase request cycle deletes $rootScope.user while it's updating.
        var user_id = $rootScope.user.id;
        var team_id = $rootScope.user.team_id;
        Account.delete($rootScope.user.id).then(function(response){
            console.log(response);
            $rootScope.setUser(null);
            $location.path('login');
        });
    };
}]);

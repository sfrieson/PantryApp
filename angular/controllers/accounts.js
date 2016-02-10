var accountsCtrl = angular.module("accountsController", ['accountService']);

accountsCtrl.controller('AccountsController', ['$scope', '$location', 'Account', function($scope, $location, Account){

    $scope.createTeam = function() {
        Account.createTeam($scope.newTeam).then(function(){
            $location.path('/team');
        });
    };
    $scope.invite = function() {
        $scope.url = "http://localhost:8080/join-team?token=" + $scope.user.team_id;
    };
    $scope.removeAccount = function() {
        //saving in variable incase request cycle deletes $scope.user while it's updating.
        var user_id = $scope.user.id;
        var team_id = $scope.user.team_id;
        Account.delete($scope.user.id).then(function(response){
            console.log(response);
            $scope.setUser(null);
            $location.path('login');
        });
    };
}]);

var app = angular.module("PantryApp", ['ngCookies']);


app.controller("MainController", ['$scope', '$http', '$cookies',
function($scope, $http, $cookies){

    $scope.user = {token: $cookies.get('pantry_app_i'), id: $cookies.get('pantry_app_id')};
    $scope.credentials = {};
    $scope.show = "lists";
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

    function getLists () {
        $http.get('/lists').then(function(response){
            $scope.lists = response.data.lists;
        });
    }
    $scope.getList = function (id) {
        $http.get('/lists/'+id).then(function(response){
            $scope.list = response.data.list;
            $scope.list.items = $scope.list.items || [];
            $scope.show="list";
        });
    };
    $scope.addListItem = function ( ){
        $http.post('/lists/item', {list: $scope.list, listItem: $scope.newListItem}).then(function(response){
            $scope.list.items.push(response.data.item);
            $scope.newListItem = {};
        });
    };
    $scope.addList = function() {
        $http.post('/lists', {list: $scope.newList}).then(function(response){
            $scope.show="lists";
            $scope.newList = {};
            $scope.lists.push(response.data.list);
        });
    };
    getLists();
}]);

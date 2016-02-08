var app = angular.module("PantryApp", ['ngCookies']);


app.controller("MainController", ['$scope', '$http', '$cookies',
function($scope, $http, $cookies){
    var token = $cookies.get('pantry_app_t');
    $http.get('/token/' + token  ).then(function(response){
        console.log(response.data);
        $scope.user = response.data;
    }); //{token: $cookies.get('pantry_app_t'), id: $cookies.get('pantry_app_id')}
    $scope.credentials = {};
    $scope.show = "lists";
    $scope.header="Well, howdy there...";
    $scope.login = function() {
        $http.post('/login', {user: $scope.credentials}).then(function (response) {
            console.log("putting cookies");
            var user = response.data.user;
            $scope.user = user;
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
    $scope.logout = function() {
        $cookies.remove('pantry_app_t');
        $cookies.remove('pantry_app_id');
        $scope.user = null;
    };
    getLists();
}]);

var app = angular.module('PantryApp', [
    'ngCookies',
    'ngRoute',
    'mainController',
    'accountsController',
    'loginController',
    'listsController',
    'listItemsController'
]);

app.config(['$routeProvider', function( $routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: '/views/partials/login.html',
            controller: 'LoginController'
        })
        .when('/lists', {
            templateUrl: '/views/partials/lists.html',
            controller: 'ListsController'
        })
        .when('/lists/new', {
            templateUrl: '/views/partials/new_list.html',
            controller: 'ListsController'
        })
        .when('/lists/:id', {
            templateUrl: 'views/partials/list.html',
            controller: 'ListItemsController'
        })
        .when('/team', {
            templateUrl: 'views/partials/team.html',
            controller: 'ListItemsController'
        })
        .when('/settings', {
            templateUrl: 'views/partials/settings.html',
            controller: 'AccountsController'
        })
        .otherwise({
            redirectTo: '/login'
        });
}]);

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

var liCtrl = angular.module('listItemsController', ['ListItemsFactory', 'listsFactory']);

liCtrl.controller('ListItemsController', [
    '$scope',
    '$routeParams',
    'ListItem',
    'List',

    function(
        $scope,
        $routeParams,
        ListItem,
        List){
    if (!$scope.user) {
        $location.path('/login');
    }
    ListItem.getList($routeParams.id).then(function(response){
        $scope.list = response.data;

    });

    $scope.addListItem = function() {
        ListItem.create($scope.list, $scope.newListItem).then(function(response){
            $scope.list.items.push(response.data);
            $scope.newListItem = {};
        });
    };

    $scope.delete = function(id, index) {
        ListItem.delete(id).then(function(response){
            console.log(response.data);
            $scope.list.items.splice(index, 1);
        });
    };
    $scope.findFood = function(listItem) {
        if(listItem.ndb_no) {
            ListItem.nutrition(listItem.ndb_no).then(function(response){
                $scope.listItem = listItem;
                console.log(response.data);
                $scope.nutrients = response.data;
            });
        } else {
            ListItem.findFood(listItem.name).then(function(response){
                console.log(response);
                $scope.listItem = listItem;
                $scope.results = response.data;
            });
        }
    };
    $scope.saveFood = function(){
        ListItem.edit($scope.listItem).then(function(response){
            console.log("Move along... here's your response:", response);
            $scope.listItem = null;
            $scope.results = null;
        });
    };

    $scope.moveToInventory = function() {
        var inventory;
        var next = function() {
            ListItem.switchList(inventory, $scope.list.items).then(function(response){
                console.log(response);
            });
        };
        console.log($scope.user);
        if(!$scope.user.lists){
            List.getList().then(function(response){
                console.log(response);
                $scope.user.lists = response.data.lists;
                $scope.user.lists.map(function(item){
                    if (item.type === "inventory") inventory = item;
                    next();
                });
            });
        } else {
            $scope.user.lists.map(function(item){
                if (item.type === "inventory") inventory = item;
            });
            next();
        }
    };
}]);

var listCtrl = angular.module("listsController", ['listsFactory']);

listCtrl.controller('ListsController', ['$scope', '$http', "$location", 'List', function($scope, $http, $location, List){
    if (!$scope.user) {
        $location.path('/login');
    }
    // Get all lists when you arrive here.
    List.getList().then(function(response){
        $scope.lists = response.data.lists;
        $scope.user.lists = $scope.lists;
    });

    // ------------- CREATE -------------
    $scope.addList = function(){
        $scope.newList.account_id = $scope.newList.account_id || $scope.user.id;
        List.add($scope.newList).then(function(response){
            $scope.newList = {};
            $scope.lists.push(response.data.list);
            $location.path('/lists');
        });
    };
    // ------------- READ -------------
    $scope.getList = function(id){
        List.getList(id).then(function(response){
            $scope.list = response.data.list;
            $scope.list.items = $scope.list.items || [];
        });
    };
    // ------------- UPDATE -------------
    // ------------- DESTROY -------------

    $scope.deleteList = function(id){
        List.deleteList(id).then(function(response){
            console.log(response);
        });
    };

    // ------------- LIST ITEMS -------------
    $scope.addListItem = function(){
        List.addListItem().then(function(response){
            $scope.list.items.push(response.data.item);
        });
    };
    $scope.deleteListItem = function(id){
        List.deleteListItem(id).then(function(response){console.log(response);});
    };
}]);

var ctrl = angular.module("loginController", ['authService']);

ctrl.controller("LoginController", ['$scope', '$cookies', '$location', 'Auth', function($scope, $cookies, $location, Auth){
    $scope.credentials = {};

    $scope.login = function() {
        user = Auth.login($scope.credentials).then(function (response) {
            $scope.credentials = {};

            if(response.data.user){
            var user = response.data.user;
            console.log("putting cookies");
                $cookies.put('pantry_app_t', user.token);

                $scope.setUser(user);
                $location.path('/lists');
            }
        });
    };


}]);

var ctrl = angular.module("mainController", ['accountService']);

ctrl.controller("MainController", ['$scope', '$location', '$cookies', 'Account',
function($scope, $location, $cookies, Account){

    Account.getByToken( $cookies.get('pantry_app_t') ).then(function(response){
        $scope.user = response.data;
    });

    $scope.setUser = function(user) {
        $scope.user = user;
    };

    $scope.logout = function() {
        $cookies.remove('pantry_app_t');
        $scope.setUser(null);
        $location.path('/login');
    };

    $scope.header="Well, howdy there...";
}]);

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

var authService = angular.module("authService", ['ngCookies']);

authService.factory('Auth', ['$http', '$cookies', function($http, $cookies){
    var Auth = {};
    
    Auth.login = function (credentials){
        return $http.post('/login', {user: credentials});
    };

    return Auth;
}]);

var liFactory = angular.module('ListItemsFactory', []);

liFactory.factory('ListItem', ['$http', function($http){
    var ListItem = {};

    // -------------------- CREATE --------------------

    ListItem.create = function(list, listItem){
        return $http.post('/lists/items', {list:list, listItem: listItem});
    };
    // -------------------- READ --------------------
    ListItem.getList = function(listId){
        return $http.get('/lists/'+listId);
    };
    ListItem.findFood = function(name){
        name = name.split(' ').join('+');
        return $http.get('/lists/items/find?name=' + name);
    };
    ListItem.nutrition = function(ndb_no) {
        return $http.get('/lists/items/nutrition?ndb_no=' + ndb_no);
    };
    // -------------------- UPDATE --------------------
    ListItem.edit = function(item){
        return $http.patch('/lists/items', {item: item});
    };
    ListItem.switchList = function(targetList, itemsArr) {
        return $http.patch('/lists/items/move-all', {targetList: targetList, itemsArr: itemsArr});
    };
    // -------------------- DESTROY --------------------
    ListItem.delete = function(listItemId){
        return $http.delete('/lists/items/' + listItemId);
    };
    return ListItem;
}]);

var listModel = angular.module('listsFactory', []);

listModel.factory('List', ['$http', function($http){
    var List = {};

    // ------------- CREATE -------------
    List.add = function(newList) {
        return $http.post('/lists', {list: newList});
    };
    // ------------- READ -------------
    List.getList = function (id) { //All lists on user if no id.
        id = id || "";
        return $http.get('/lists/'+id);
    };
    // ------------- UPDATE -------------
    // ------------- DESTROY -------------
    List.deleteList = function (id) {
        return $http.delete('/lists/'+id);
    };
    // ------------- LIST ITEMS -------------
    List.addListItem = function (list, listItem ){
        return $http.post('/lists/items', {list: list, listItem: listItem});
    };
    List.deleteListItem = function(id) {
        return $http.delete('/lists/items/' + id);
    };
    return List;
}]);

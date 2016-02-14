var foodCtrl = angular.module("foodsController", ['ListItemsFactory']);
foodCtrl.controller("FoodsController", [
    '$scope',
    '$mdDialog',
    'ListItem',
    'listItem',
    'data',
    function(
        $scope,
        $mdDialog,
        ListItem,
        listItem,
        data){
            console.log('li:', listItem);
            $scope.listItem = listItem;
            $scope.data = data;
            $scope.heading = "It's working!";

            $scope.saveFood = function(){
                console.log($scope.nbd_no);
                ListItem.edit($scope.listItem).then(function(response){
                    console.log("Move along... here's your response:", response);
                    $mdDialog.hide();
                });
            };
            $scope.closeModal = function(){
                $mdModal.hide();
            }
        }]);

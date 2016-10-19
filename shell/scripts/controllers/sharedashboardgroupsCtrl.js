routerApp.controller('sharedashboardgroupsCtrl', [ '$scope', '$mdDialog','$rootScope', '$http', function( $scope, $mdDialog,$rootScope, $http ) {

    $scope.users =[];
    $scope.groups=[];
    $scope.selected = [];
    $scope.selectedgroups = [];

    

    $http.get('http://omalduosoftwarecom.prod.digin.io/apis/usercommon/getSharableObjects')
       .then(function(result) {
            ////return result.data;
             for (var i = 0, len = result.data.length; i<len; ++i) {
                if (result.data[i].Type == "User") {
                    $scope.users.push(result.data[i]);
                }else if (result.data[i].Type == "Group") {
                    $scope.groups.push(result.data[i]);
                }
            }

            //------ for users ------------------------------------------------
               $scope.toggle = function (users, list) {
                var idx = list.indexOf(users);
                if (idx > -1) {
                  list.splice(idx, 1);
                  
                }
                else {
                  list.push(users);
                 
                }
              };

              $scope.exists = function (users, list) {
                return list.indexOf(users) > -1;
              };

              $scope.isIndeterminate = function() {
                return ($scope.selected.length !== 0 &&
                    $scope.selected.length !== $scope.users.length);
              };

              $scope.isChecked = function() {
                return $scope.selected.length === $scope.users.length;
              };

              $scope.toggleAll = function() {
                if ($scope.selected.length === $scope.users.length) {
                  $scope.selected = [];
                } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                  $scope.selected = $scope.users.slice(0);
                }
              };

             //-------------------------------------------------------------
             
             //-------------for groups -------------------------------------
               $scope.toggleGroup = function (item, list) {
                var idx = list.indexOf(item);
                if (idx > -1) {
                  list.splice(idx, 1);
                }
                else {
                  list.push(item);
                }
              };

              $scope.existsGroup = function (item, list) {
                return list.indexOf(item) > -1;
              };

              $scope.isIndeterminateGroup = function() {
                return ($scope.selectedgroups.length !== 0 &&
                    $scope.selectedgroups.length !== $scope.groups.length);
              };

              $scope.isCheckedGroup = function() {
                return $scope.selectedgroups.length === $scope.groups.length;
              };

              $scope.toggleAllGroup = function() {
                if ($scope.selectedgroups.length === $scope.groups.length) {
                  $scope.selectedgroups = [];
                } else if ($scope.selectedgroups.length === 0 || $scope.selectedgroups.length > 0) {
                  $scope.selectedgroups = $scope.groups.slice(0);
                }
              };

             //------------------------------------------------------------- 
            
        },function errorCallback(response) {
            //notifications.toast(0, "Falied to get users");
     });    

       $scope.getArray = function (){
            alert($scope.selected);
            $rootScope.dashboard;
            alert($scope.selectedgroups);
       }
      


}]);

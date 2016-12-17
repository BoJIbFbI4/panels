angular.module('panelsApp')
   .controller('AuthCtrl', ['$scope', '$http','$state', function ($scope, $http, $state) {

       $scope.isLogin = false;
       var url = "https://panel-repatriation.rhcloud.com/common/login";



      $scope.getLogin = function () {
          var authorizationData = btoa($scope.login + ":" + $scope.pass);
          /*$rootScope.ad = authorizationData;*/

          var config = {

              headers: {
                  "Authorization": "Basic " + authorizationData
              }
          };

          $http.get(url,config).success(function (response) {
              $scope.isLogin = true;
              $scope.id = response.id;
              $scope.type = response.type;
              console.log(response.id);
              console.log(response.type);
              $scope.toggleLeftSideBar = true;

              if (response.type == "ADMIN") {
                   $state.go('companies')
              }
              if (response.type == "MANAGER"){
                  $state.go('projects')
              }

          })



      }


   }]);
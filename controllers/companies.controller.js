/**
 * Created by Gladkov Kirill on 12/11/2016.
 */
angular.module('panelsApp')
    .controller('CompaniesCtrl', ['$rootScope','$scope', '$http', 'CompaniesService', '$state',
        function ($rootScope, $scope, $http, CompaniesService, $state) {

            $rootScope.headerTitle = "companies";
            $scope.companies = [];
            $rootScope.layout = $state.current.data.layout;

            CompaniesService.then(function (result) {
                $scope.companies = result;
                $rootScope.companies = result;
                // console.log($scope.companies);
            });

            $scope.goToProjects = function (companyID) {
                $state.go('projects', {companyID: companyID})
            };

        }])

    .service('CompaniesService', ['$rootScope', '$http', function ($rootScope, $http) {
        $rootScope.showLoader = true;
        var url = $rootScope.url + "/admin/";
        var authorizationData = $rootScope.authorizationData;
        var config = {
            headers: {
                "Authorization": "Basic " + authorizationData
            }
        };

        if (authorizationData == undefined){
          console.log(authorizationData);
          console.log("Companies auth data lost");
          // $state.go("auth");
          $rootScope.logout();
        }
        if (authorizationData == ""){
          console.log(authorizationData);
          console.log("Companies auth data empty");
          // $state.go("auth");
          $rootScope.logout();
        }
        //
        return $http.get(url + 'getCustomers', config).then(function (result) {
            $rootScope.showLoader = false;
            return result.data;
        })

    }]);

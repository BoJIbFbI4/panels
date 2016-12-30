/**
 * Created by Gladkov Kirill on 12/11/2016.
 */
angular.module('panelsApp')
    .controller('CompaniesCtrl', ['$rootScope','$scope', '$http', 'CompaniesService', '$state',
        function ($rootScope, $scope, $http, CompaniesService, $state) {

            $rootScope.headerTitle = "Companies";
            $scope.companies = [];
            $rootScope.layout = $state.current.data.layout;

            CompaniesService.then(function (result) {
                $scope.companies = result;
                // console.log($scope.companies);
            });

            $scope.goToProjects = function (companyID) {
                $state.go('projects', {companyID: companyID})
            };

        }])

    .service('CompaniesService', ['$rootScope','$http', function ($rootScope ,$http) {
        var url = "https://panel-repatriation.rhcloud.com/admin/";
        var authorizationData = $rootScope.authorizationData;
        var config = {
            headers: {
                "Authorization": "Basic " + authorizationData
            }
        };

        return $http.get(url + 'getCustomers', config).then(function (result) {
            return result.data;
        })

    }]);

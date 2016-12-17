/**
 * Created by Gladkov Kirill on 12/11/2016.
 */
angular.module('panelsApp')
    .controller('CompaniesCtrl', ['$scope', '$http', 'CompaniesService', '$state',
        function ($scope, $http, CompaniesService, $state) {

            $scope.companies = [];

            CompaniesService.then(function (result) {
                $scope.companies = result;
                // console.log($scope.companies);
            });

            $scope.goToProjects = function (companyID) {
                $state.go('projects', {companyID: companyID})
            };

        }])

    .service('CompaniesService', ['$http', function ($http) {
        var url = "https://panel-repatriation.rhcloud.com/admin/";
        var authorizationData = window.btoa("Admin:12345");
        var config = {
            headers: {
                "Authorization": "Basic " + authorizationData
            }
        };

        return $http.get(url + 'getCustomers', config).then(function (result) {
            return result.data;
        })

    }]);

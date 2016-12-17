/**
 * Created by Gladkov Kirill on 12/12/2016.
 */
angular.module('panelsApp')
    .controller('ProjectCtrl', ['$scope', '$stateParams', '$http', function ($scope, $stateParams, $http) {

        var url = "https://panel-repatriation.rhcloud.com/admin/";
        var authorizationData = window.btoa("Admin:12345");
        var config = {headers: {
            "Authorization": "Basic " + authorizationData
            }
        };

        $scope.projects = [];

        var getProjects = function (companyID) {
            return $http.get(url + '/getProjectsByIdCustomer/' + companyID, config).then(function (response) {
                // console.log(response.data);
                $scope.projects = response.data;
            })
        };

        if ($stateParams.companyID) {
            getProjects($stateParams.companyID)
        }


    }]);

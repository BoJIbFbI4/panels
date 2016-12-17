/**
 * Created by Gladkov Kirill on 12/12/2016.
 */
angular.module('panelsApp')
    .controller('ProjectCtrl', ['$rootScope','$scope', '$stateParams', '$http', '$state',
                        function ($rootScope, $scope, $stateParams, $http, $state) {

        $rootScope.headerTitle = "Projects";
        $rootScope.layout = $state.current.data.layout;

        var url = "https://panel-repatriation.rhcloud.com";
        var authorizationData = $rootScope.authorizationData;
        var config = {headers: {
            "Authorization": "Basic " + authorizationData
            }
        };

        $scope.projects = [];


        var getProjects = function (companyID) {
            return $http.get(url + '/admin/getProjectsByIdCustomer/' + companyID, config).then(function (response) {
                // console.log(response.data);
                $scope.projects = response.data;
            })
        };

        if ($stateParams.companyID) {
            getProjects($stateParams.companyID)
        }


        var getManagerProjects = function (managerID) {
            return $http.get(url + '/managers/getProjectsByIdManager/' + managerID, config).then(function (response) {
                // console.log(response.data);
                $scope.projects = response.data;
            })
        };

        if ($stateParams.managerID){
            getManagerProjects($stateParams.managerID)
        }



    }]);

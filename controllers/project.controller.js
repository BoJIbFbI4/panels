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
                console.log(response);
                $rootScope.createProjectDate = response.data[0].questionary.createDate;
                $scope.projects = response.data;
            })
        };

        if ($stateParams.companyID) {
            getProjects($stateParams.companyID)
        }


        var getManagerProjects = function (managerID) {
            return $http.get(url + '/managers/getProjectsByIdManager/' + managerID, config).then(function (response) {
                $rootScope.chengeMenu = true;
                $rootScope.userFace = 'https://s3.amazonaws.com/uifaces/faces/twitter/silvanmuhlemann/128.jpg';
                $rootScope.panelUser = "Manager Page";
                $scope.projects = response.data;

            })
        };



        if ($stateParams.managerID){

            getManagerProjects($stateParams.managerID)
        }



    }]);

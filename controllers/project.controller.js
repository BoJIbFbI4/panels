/**
 * Created by Gladkov Kirill on 12/12/2016.
 */
angular.module('panelsApp')
    .controller('ProjectCtrl', ['$rootScope', '$scope', '$stateParams', '$http', '$state', 'serviceButtons',
        function ($rootScope, $scope, $stateParams, $http, $state, serviceButtons) {
            $rootScope.sendExcel = false;
            $scope.hideMe = false;
            $scope.projects = [];
            $rootScope.headerTitle = "projects";
            $rootScope.layout = $state.current.data.layout;


            var url = $rootScope.url;
            var authorizationData = $rootScope.authorizationData;
            var config = {
                headers: {
                    "Authorization": "Basic " + authorizationData
                }
            };

            $scope.goToSurvey = function (projectID, projectName) {
                $state.go('diagrams', {projectID: projectID, projectName:projectName})
            };

            var getProjects = function (companyID) {
                $rootScope.showLoader = true;
                return $http.get(url + '/admin/getProjectsByIdCustomer/' + companyID, config).then(function (response) {
                    console.log("project response: " ,response);
                    $scope.projects = response.data;
                    $rootScope.showLoader = false;
                })
            };

            if ($stateParams.companyID) {
                getProjects($stateParams.companyID)
            }


            // function for upload excel file with new users. Placed here because it use this questionary ID
            $scope.uploadFile = function (projectID, myFile, index) {
                // console.log(projectID);
                // console.log(myFile);
                console.log(index);
                $rootScope.hideLoader[index]=true;
                console.log("$rootScope.hideLoader");
                console.log($rootScope.hideLoader);

                return serviceButtons.uploadFile(myFile, projectID, index);
            };


            var getManagerProjects = function (managerID) {
                $rootScope.showLoader = true;
                return $http.get(url + '/managers/getProjectsByIdManager/' + managerID, config).then(function (response) {
                    $rootScope.chengeMenu = true;
                    $rootScope.userFace = 'https://s3.amazonaws.com/uifaces/faces/twitter/silvanmuhlemann/128.jpg';
                    $scope.projects = response.data;
                    $rootScope.showLoader = false;
                })
            };

            if ($stateParams.managerID) {
                getManagerProjects($stateParams.managerID)
            }



        }]);
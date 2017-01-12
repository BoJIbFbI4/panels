angular.module('panelsApp')
    .controller('AlertCtrl', ['$scope','$rootScope','$http', '$mdDialog', function ($scope, $rootScope, $http, $mdDialog) {

        $scope.sortType     = 'humanDate';   // set the default sort type
        $scope.sortReverse  = false;
        $scope.id = $rootScope.id;

        $scope.isCurrentSuperviser = function () {
            return $rootScope.curAlert.supervisoryManager.id == $rootScope.id
        }

        $scope.getCompanies = function () {
            return $rootScope.companies
        }

        $scope.sendCustomAlert = function () {

            var url = $rootScope.url + "/admin/sendTextToGeneralOfProject/" + $scope.company
            var data= $scope.textAlert

            var config = { headers:
                {"Authorization": "Basic " + $rootScope.authorizationData},
                params: {"text" : data}
            };

            console.log("this is value!! : " + $scope.company)

            $http.post(url, data, config).then(function (response) {
                console.log(response)
            })

        }

        $scope.getCurAlert = function () {
            return $rootScope.curAlert
        };

        $scope.getHumanDate = function (dateRobotic) {
            var dateHuman = new Date(dateRobotic)
            return dateHuman
        }

        $scope.id = $rootScope.id

        $scope.getCurAlertDate = function () {

            var normalDate = new Date($rootScope.curAlert.createDate);

            return normalDate
        };

        $scope.closeAlert = function () {
            var url = $rootScope.url + "/managers/closeAlert/" + $rootScope.curAlert.id;

            var config = { headers:
                {"Authorization": "Basic " + $rootScope.authorizationData}

                 };
            $http.get(url, config).then(function (response) {

                console.log(response)
            })
        }

        $scope.setText = function () {
            var url = $rootScope.url + "/managers/setTextInAlert/" + $rootScope.curAlert.id;

            var data= $('#inputText').val();

            var config = { headers:
                {"Authorization": "Basic " + $rootScope.authorizationData},
                params: {"text" : data}
            };

            console.log("this is data!!! : " + data);

            $http.post(url, data, config).then(function (response) {
                console.log(response)
            });

            $scope.hide()

        }

    }]);
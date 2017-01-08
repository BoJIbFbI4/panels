angular.module('panelsApp')
    .controller('AlertCtrl', ['$scope','$rootScope','$http', '$mdDialog', function ($scope, $rootScope, $http, $mdDialog) {

        $scope.getCurAlert = function () {
            return $rootScope.curAlert
        };

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
            var url = $rootScope.url + "/managers/setTextInAlert/" + $rootScope.curAlert.id

            var data= $('#inputText').val()

            var config = { headers:
                {"Authorization": "Basic " + $rootScope.authorizationData},
                params: {"text" : data}
            };

            console.log("this is data!!! : " + data)

            $http.post(url, data, config).then(function (response) {
                console.log(response)
            })

            $scope.hide()

        }

    }]);
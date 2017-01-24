angular.module('panelsApp')
    .controller('AuthCtrl', ['$rootScope', '$scope', '$http', '$state', '$timeout', function ($rootScope, $scope, $http, $state, $timeout) {

        $scope.isLogin = false;
        $rootScope.headerTitle = "panels";
        $rootScope.authorizationData = "";
        $rootScope.layout = "";
        $scope.loginProcess = false;

        $scope.getLogin = function () {
            var url = $rootScope.url + "/common/login";
            var authorizationData = btoa($scope.login + ":" + $scope.pass);
            //var authorizationData = btoa("ManagerClalitProject0City1Group1" + ":" + "ManagerClalitProject0City1Group1"); // mock manger
            //var authorizationData = btoa("Admin" + ":" + "12345"); // mock admin
            $rootScope.authorizationData = authorizationData;
            var config = {headers: {"Authorization": "Basic " + authorizationData}};

            $scope.loginProcess = true;
            console.log('loginProcess до гет запроса: ',$scope.loginProcess);
            return $http.get(url, config)
                .success(function(response) {
                    $scope.id = response.id;
                    $rootScope.id = response.id;
                    $rootScope.type = response.type;

                    $rootScope.openAlertCount = 0;

                    if (response.type == "ADMIN") {
                        $state.go('companies')
                    }
                    if (response.type == "MANAGER") {
                        console.log(response);
                        $rootScope.alerts = response.supervisoryAlerts;
                        $rootScope.alerts =  $rootScope.alerts.concat(response.responsibleAlerts);
                        console.log(' = = = = item.closeDate = = = = = ');

                        $rootScope.alerts.forEach(function (item, i, arr) {
                            item.humanDate = (new Date(item.createDate)).toDateString();
                            item.status = item.closeDate == undefined ? "Open" : "Closed";
                            $rootScope.alerts[i].statusBool = item.closeDate != undefined;
                            $rootScope.openAlertCount = item.closeDate?$rootScope.openAlertCount:$rootScope.openAlertCount+1;
                            //If u want some custom props, please create them here to avoid making calculations in view
                        });

                        console.log(" - - - $rootScope.alerts - - - ");
                        console.log($rootScope.alerts);



                        $state.go('projects', {managerID: $scope.id})
                    }

                    $scope.isLogin = true;
                    $rootScope.isLogin = true;
                    $scope.loginProcess = false;
                })
                .error(function(data, status) {
                    $scope.login = "";
                    $scope.pass = "";
                    $scope.alert = "wrong login or password";
                    $scope.loginProcess = false;
                })
        };

        $rootScope.logout = function () {
            $scope.login = "";
            $scope.pass = "";
            $scope.isLogin = false;
            $rootScope.authorizationData = "";
            $state.go('auth');
            location.reload();
        }


    }]);
angular.module('panelsApp')
    .controller('AuthCtrl', ['$rootScope', '$scope', '$http', '$state', '$timeout', function ($rootScope, $scope, $http, $state, $timeout) {

        $scope.isLogin = false;
        $rootScope.headerTitle = "panels";
        $rootScope.authorizationData = "";
        $rootScope.layout = "";
        $scope.loginProcess = false;

        //

        $scope.getLogin = function () {
            var url = $rootScope.url + "/common/login";
            var authorizationData = btoa($scope.login + ":" + $scope.pass);
            $rootScope.authorizationData = authorizationData;
            var config = {headers: {"Authorization": "Basic " + authorizationData}};

            $scope.loginProcess = true;
            console.log('loginProcess до гет запроса: ',$scope.loginProcess);
            return $http.get(url, config)
                .success(function(response) {
                    $scope.id = response.id;
                    $rootScope.type = response.type;

                    if (response.type == "ADMIN") {
                        $state.go('companies')
                    }
                    if (response.type == "MANAGER") {
                        $rootScope.alerts = response.supervisoryAlerts;
                        $state.go('projects', {managerID: $scope.id})
                    }

                    $scope.isLogin = true;
                    $scope.loginProcess = false;
                    console.log('loginProcess в конце success гет запроса: ',$scope.loginProcess);
                })
                .error(function(data, status) {
                    $scope.login = "";
                    $scope.pass = "";
                    $scope.alert = "wrong login or password";
                    $scope.loginProcess = false;
                    console.log('loginProcess в конце error гет запроса: ',$scope.loginProcess);
                })
                .finally(function() {
                    $scope.loginProcess = false;
                    console.log("finally finished repos");
                    console.log('loginProcess в конце finaly гет запроса: ',$scope.loginProcess);
                });
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
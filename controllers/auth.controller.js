angular.module('panelsApp')
    .controller('AuthCtrl', ['$rootScope', '$scope', '$http', '$state', '$timeout', function ($rootScope, $scope, $http, $state, $timeout) {

        $scope.isLogin = false;
        $scope.loginProcess = false;
        $rootScope.headerTitle = "panels";
        $rootScope.authorizationData = "";
        $rootScope.layout = "";


        $scope.getLogin = function () {
            $scope.loginProcess = true;
            var url = $rootScope.url + "/common/login";
            var authorizationData = btoa($scope.login + ":" + $scope.pass);
            $rootScope.authorizationData = authorizationData;
            var config = {headers: {"Authorization": "Basic " + authorizationData}};

            $http.get(url, config).success(function (response) {
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

            }).error(function (response){
                if ($scope.loginProcess) $scope.loginProcess = false;
                $scope.login = "";
                $scope.pass = "";
                $scope.alert = "wrong login or password";
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
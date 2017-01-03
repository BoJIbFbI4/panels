angular.module('panelsApp')
    .controller('AuthCtrl', ['$rootScope','$scope', '$http', '$state', function ($rootScope ,$scope, $http, $state) {

        $scope.isLogin = false;
        $rootScope.headerTitle = "panels";
        $rootScope.authorizationData = "";
        $rootScope.layout = "";



        $scope.getLogin = function () {
            var url = $rootScope.url + "/common/login";
            var authorizationData = btoa($scope.login + ":" + $scope.pass);
            $rootScope.authorizationData = authorizationData;
            var config = { headers: {"Authorization": "Basic " + authorizationData} };

            $http.get(url, config).success(function (response) {
                $scope.isLogin = true;
                $scope.id = response.id;
                $rootScope.type = response.type;



                if (response.type == "ADMIN") {
                    $state.go('companies')
                }
                if (response.type == "MANAGER") {
                    $rootScope.alerts = response.supervisoryAlerts;
                    $state.go('projects', {managerID: $scope.id})
                }

                console.log(response)

            }).error(function (response) {
                $scope.login = "";
                $scope.pass = "";
                $scope.alert = "wrong login or password"
            })


        }


    }]);
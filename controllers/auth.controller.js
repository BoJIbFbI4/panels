angular.module('panelsApp')
    .controller('AuthCtrl', ['$rootScope','$scope', '$http', '$state', function ($rootScope ,$scope, $http, $state) {

        $scope.isLogin = false;
        $rootScope.headerTitle = "Panels";
        $rootScope.authorizationData = "";
        $rootScope.layout = "";



        $scope.getLogin = function () {
            var url = "https://panel-repatriation.rhcloud.com/common/login";
            var authorizationData = btoa($scope.login + ":" + $scope.pass);
            $rootScope.authorizationData = authorizationData;
            var config = { headers: {"Authorization": "Basic " + authorizationData} };

            $http.get(url, config).success(function (response) {
                $scope.isLogin = true;
                $scope.id = response.id;
                $scope.type = response.type;

                if (response.type == "ADMIN") {
                    $state.go('companies')
                }
                if (response.type == "MANAGER") {
                    $state.go('projects', {managerID: $scope.id})
                }

            })


        }


    }]);
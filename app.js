var app = angular.module('panelsApp', ['Route', 'ngResource', 'ngMaterial']);
app.controller('MainController', ['$rootScope', '$scope', 'translationService', '$mdDialog', '$state', function($rootScope, $scope, translationService, $mdDialog, $state) {

    // $rootScope.url = "https://panel-repatriation.rhcloud.com";
    $rootScope.url = "https://panel1-repatriation.rhcloud.com";
    // $rootScope.url = "http://192.168.1.101:8080";
    // $rootScope.url = "http://172.20.10.4:8080";
    // $rootScope.url = "http://192.168.1.101:8080";
    // $rootScope.url = "http://10.0.0.17:8080";

    $rootScope.labelKeyPressed = function() {
        console.log('trololo');
    }
    $rootScope.hideLoader = [];
    $rootScope.fileState = [];

    $scope.$watchGroup(['authorizationData'],function(newData, oldData){
      console.log(newData, oldData);

      if (newData[0] == "" & !oldData[0]){
        console.log("Auth Data Lost")
      }
    })

    $scope.home = function() {

        if ($rootScope.type == "MANAGER") {
            $state.go('projects', {
                managerID: $scope.id
            })
        } else {
            console.log('Login process is :' + $scope.loginProcess);
            $state.go('companies')
        }
    };


    // ALERT PAGE MANAGER
    $scope.alertTable = function() {
        $state.go('alerts')
    };

    $scope.createAlert = function() {
        $state.go('createAlert')
    };


    $rootScope.fieldChanged = function(event) {
        console.log('event');
        console.log(event);
    };

    $rootScope.alertInfo = function(alert, index) {
        $rootScope.curAlert = alert;
        $rootScope.curAlert.index = index;
        console.log($scope.curAlert);
        console.log("Supervisory Id in alert = " + $rootScope.curAlert.supervisoryManager.id);
        console.log("Login Id = " + $rootScope.id);
        $mdDialog.show({
                controller: AlertInfoController,
                templateUrl: 'templates/alertInfoWindow.html',
                parent: angular.element(document.body),
                targetEvent: alert,
                clickOutsideToClose: true,
                fullscreen: false // Only for -xs, -sm breakpoints.
            })
            .then(function(alert) {
                $scope.curAlert = alert
            }, function() {
                console.log('Login process is :' + $scope.loginProcess);
                $scope.curAlert = alert;

            })
    };


    function AlertInfoController($scope, $mdDialog) {

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }

    if (!$rootScope.chengeMenu) {
        $rootScope.panelUser = "adminHeader";
        $rootScope.userFace = 'https://s3.amazonaws.com/uifaces/faces/twitter/commadelimited/128.jpg';
    }

    //Выполняем перевод, если произошло событие смены языка
    $scope.translate = function() {
        translationService.getTranslation($scope, $scope.selectedLanguage);
    };
    // Инициализация
    if (!$scope.selectedLanguage) {
        $scope.selectedLanguage = 'en';
        $scope.translate();
    }

    $scope.isManager = function() { // test this
        $rootScope.type == "MANAGER" ? $rootScope.panelUser = "managerHeader" : $rootScope.panelUser = "adminHeader";
        return $rootScope.type == "MANAGER";
    };

    $scope.isLogin = function() {
        return $rootScope.isLogin
    };



    $rootScope.getAlerts = function() {
        if ($scope.isManager() == true) {
            $rootScope.openAlerts.forEach(function(item, i, arr) {
                item.humanDate = (new Date(item.createDate)).toDateString();
                item.status = item.closeDate == undefined ? "Open" : "Closed";
                // $rootScope.openAlertCount = item.closeDate ? $rootScope.openAlertCount : $rootScope.openAlertCount + 1;
                $rootScope.openAlerts[i].statusBool = item.closeDate == undefined;
                //If u want some custom props, please create them here to avoid making calculations in view
            })
        }
        // $rootScope.openAlerts = $rootScope.openAlerts.filter(function (alert) {return alert.closeDate == undefined});
        // console.log("$rootScope.openAlerts");
        // console.log($rootScope.openAlerts);
        $rootScope.openAlertCount = $rootScope.openAlerts.length;
        return $rootScope.openAlerts;
    }

    $(document).ready(function() {
        $state.go('auth');

        return false;
    });


}]);

app.service('translationService', function($resource) {

    this.getTranslation = function($scope, language) {
        var languageFilePath = 'multiLanguage/lang_' + language + '.json';
        console.log(language);
        $resource(languageFilePath).get(function(data) {
            $scope.translation = data;
        });
    };
});

app.service('fileUpload', ['$http', '$rootScope', function($http, $rootScope) {
    var authorizationData = $rootScope.authorizationData;
    this.uploadFileToUrl = function(file, uploadUrl, index) {
        var fd = new FormData();
        fd.append('file', file);



        $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'Authorization': 'Basic ' + authorizationData
                }
            })
            .success(function(resp) {
                console.log(resp);
                $rootScope.hideLoader[index] = false;
                $rootScope.fileState[index] = 'File Uploaded: ' + resp


            })
            .error(function(error) {
                console.log(error);
                for (e in error){
                  console.log(e);
                }
                $rootScope.hideLoader[index] = false;
                $rootScope.fileState[index] = 'Not loaded - Error'


            });
    };
}]);


app.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

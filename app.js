var app = angular.module('panelsApp', ['Route', 'ngResource', 'ngMaterial']);
app.controller('MainController', ['$rootScope', '$scope', 'translationService','$mdDialog', function ($rootScope, $scope, translationService, $mdDialog) {

    $rootScope.url = "https://panel1-repatriation.rhcloud.com";
    // $rootScope.url = "http://192.168.1.101:8080";



      $scope.alertInfo = function (alert){

          $rootScope.curAlert = alert;

          console.log($scope.curAlert);

        $mdDialog.show({
            controller: AlertInfoController,
            templateUrl: 'templates/alertInfoWindow.html',
            parent: angular.element(document.body),
            targetEvent: alert,
            clickOutsideToClose:true,
            fullscreen: false // Only for -xs, -sm breakpoints.
        })
            .then(function (alert) {
                $scope.curAlert = alert
            }, function () {
                $scope.curAlert = alert
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

    if (!$rootScope.chengeMenu){
        $rootScope.panelUser = "adminHeader";
        $rootScope.userFace = 'https://s3.amazonaws.com/uifaces/faces/twitter/commadelimited/128.jpg';
    }

    //Выполняем перевод, если произошло событие смены языка
    $scope.translate = function () {
        translationService.getTranslation($scope, $scope.selectedLanguage);
    };
    // Инициализация
    if (!$scope.selectedLanguage) {
        $scope.selectedLanguage = 'en';
        $scope.translate();
    }
//
    $scope.isManager = function () {
        $rootScope.type == "MANAGER" ? $rootScope.panelUser = "managerHeader" : $rootScope.panelUser = "adminHeader";
        return $rootScope.type == "MANAGER";
    };

    $scope.getAlerts = function () {
        return $rootScope.alerts;
    }

;
}]);

app.service('translationService', function ($resource) {

    this.getTranslation = function ($scope, language) {
        var languageFilePath = 'multiLanguage/lang_' + language + '.json';
        console.log(language);
        $resource(languageFilePath).get(function (data) {
            $scope.translation = data;
        });
    };
});

 app.service('fileUpload', ['$http', '$rootScope', function ($http, $rootScope) {
     var authorizationData = $rootScope.authorizationData;
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined,
                        'Authorization': 'Basic ' + authorizationData}
        })
            .success(function(resp){
                console.log(resp);
                $rootScope.sendExcel = false;
            })
            .error(function(){
                console.log("error");
                $rootScope.sendExcel = false;
            });
    }
}]);


app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);






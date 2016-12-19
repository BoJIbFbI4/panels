var app = angular.module('panelsApp', ['Route', 'ngResource']);

app.controller('MainController', ['$rootScope', '$scope', 'translationService', function ($rootScope, $scope, translationService) {

    if (!$rootScope.chengeMenu) {
        $rootScope.panelUser = "Admin Page";
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

    $scope.isManager = function () {
        return $rootScope.type == "MANAGER";
    };

    $scope.getAlerts = function () {
        return $rootScope.alerts;
    }


}]);

app.service('translationService', function ($resource) {

    this.getTranslation = function ($scope, language) {
        var languageFilePath = 'multiLanguage/lang_' + language + '.json';
        console.log(languageFilePath);
        $resource(languageFilePath).get(function (data) {
            $scope.translation = data;
        });
    };
});

 app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(resp){
                console.log(resp)
            })
            .error(function(){
                console.log("error")

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






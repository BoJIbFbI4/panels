var app = angular.module('panelsApp', ['Route', 'ngResource']);

app.controller('MainController', ['$scope', 'translationService', function ($scope, translationService) {

    //Выполняем перевод, если произошло событие смены языка
    $scope.translate = function () {
        translationService.getTranslation($scope, $scope.selectedLanguage);
    };
    // Инициализация
    if (!$scope.selectedLanguage) {
        $scope.selectedLanguage = 'en';
        $scope.translate();
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






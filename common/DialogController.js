(function () {
    'use strict';
    angular.module('panelsApp')
        .controller('DialogController', ['$scope', '$mdDialog', 'translation', 'stats',

    function ($scope, $mdDialog, translation, stats) {
        $scope.translation = translation;
        $scope.stats = stats;

        var rRate = $scope.stats["responseRate"] + '';

        if (rRate.includes('%')) {
            $scope.stats["responseRate"] = $scope.stats["responseRate"] + '';
        }
        else {
            $scope.stats["responseRate"] = $scope.stats["responseRate"] + '%';
        }
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
    }])
    .controller('ChartsDialogController', ['$scope', '$mdDialog',
        
        function($scope, $mdDialog) {

        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
        }])

}());

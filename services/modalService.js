(function () {
    'use strict';
    angular.module('panelsApp')
        .service('modalService', ['$mdDialog',function ($mdDialog) {

            this.showModal = function(translation, stats) {
                $mdDialog.show({
                    locals: {
                        translation: translation,
                        stats: stats
                    },
                    controller: 'DialogController',
                    templateUrl: 'templates/diagramsPageStat.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: false // Only for -xs, -sm breakpoints.
                });
            };

            this.showChartDialogModal = function () {
                $mdDialog.show({
                    controller: 'ChartsDialogController',
                    templateUrl: 'templates/diagramsPage2.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: false // Only for -xs, -sm breakpoints.
                });
            };

            this.showChartDialogDatesModal = function () {
                $mdDialog.show({
                    controller: 'ChartsDialogController',
                    templateUrl: 'templates/diagramsTimeLinePage.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: false // Only for -xs, -sm breakpoints.
                });
            };

        }]);

}());

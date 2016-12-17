/**
 * Created by Gladkov Kirill on 12/12/2016.
 */
angular.module('panelsApp')
    .controller('ChartsCtrl', ['$scope','$rootScope', '$http', '$timeout','$state', function ($scope, $rootScope, $http, $timeout, $state) {

        $rootScope.headerTitle = "Charts";
        $rootScope.layout = $state.current.data.layout;
        //charts
        var donutChart = c3.generate({
            bindto: '#chart_gauge',
            title: {
                text: 'ממוצע שביעות רצון'
            },
            data: {
                columns: [
                    ['GPA', 4.5]
                ],
                type: 'gauge',
                onclick: function (d, i) {
                    $state.go('projects')
                },
                selection: {
                    draggable: true
                }
            },
            gauge: {
                label: {
                    format: function(value, ratio) {
                        return value;
                    },
                    show: true // to turn off the min/max labels.
                },
                min: 1, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
                max: 5, // 100 is default
                units: ''
//    width: 39 // for adjusting arc thickness
            },
            color: {
                pattern: ['#FF0000', '#F97600', '#F6C600','#3aaef2'], // the three color levels for the percentage values.
                threshold: {
                    max: 5, // 100 is default
                    values: [30, 60, 90, 100]
                }
            },
            size: {
                height: 180
            }
        });

        $timeout(function(){donutChart.load({columns: [['GPA', 1.2]]})}, 1000);
        $timeout(function(){donutChart.load({columns: [['GPA', 2.7]]})}, 2000);
        $timeout(function(){donutChart.load({columns: [['GPA', 4.8]]})}, 3000);
        $timeout(function(){donutChart.load({columns: [['GPA', 3.2]]})}, 4000);
        $timeout(function(){donutChart.load({columns: [['GPA', 4.6]]})}, 5000);


        var chart = c3.generate({
            title: {
                text: 'התפלגות שביעות רצון מהשירות'
            },
            data: {
                x: 'x',
                columns: [
                    ['x','כלל לא שבע/ת רצון','די לא שבע/ת רצון','שבע/ת רצון במידה בינונית','דישבע/ת רצון','שבע/ת רצון במידה רבה מאוד'],
                    ['שבע/ת רצון', 0.01, 0.01, 0.14, 0.43, 0.45]
                ],
                type: 'bar'
            },
            axis:{
                x: {
                    type: 'category'
                },
                y: {
                    tick:{
                        format: d3.format('%')
                        // values:[0.25,0.5,0.75,0.1]
                    },
                    max: 1,
                    min: 0,
                    padding: {
                        top: 10,
                        bottom: 0
                    }
                }
            },
            bar: {
                width: {
                    ratio: 0.6
                }
            },
            size: {
                height: 215
            },
            color: {
                pattern: ['#3aaef2']
            }
        });

        $timeout(function(){chart.load({columns: [['שבע/ת רצון', 0.05, 0.08, 0.25, 0.30, 0.75]]})}, 1000);
        $timeout(function(){chart.load({columns: [['שבע/ת רצון', 0.01, 0.06, 0.38, 0.25, 0.43]]})}, 2000);
        $timeout(function(){chart.load({columns: [['שבע/ת רצון', 0.1, 0.01, 0.14, 0.85, 0.64]]})}, 3000);
        $timeout(function(){chart.load({columns: [['שבע/ת רצון', 0.06, 0.19, 0.18, 0.5, 0.3]]})}, 4000);
        $timeout(function(){chart.load({columns: [['שבע/ת רצון', 0.01, 0.01, 0.12, 0.38, 0.76]]})}, 5000);

    }]);
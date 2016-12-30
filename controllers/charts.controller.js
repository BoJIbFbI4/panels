/**
 * Created by Gladkov Kirill on 12/12/2016.
 */
angular.module('panelsApp').controller('ChartsCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$state', '$filter', 'fileUpload', '$stateParams', 'getChartData',
    function ($scope, $rootScope, $http, $timeout, $state, $filter, fileUpload, $stateParams, getChartData) {

        var url = "https://panel-repatriation.rhcloud.com";
        var authorizationData = $rootScope.authorizationData;
        var config = {headers: {"Authorization": "Basic " + authorizationData}};

        $scope.surveyData = {};

        $rootScope.headerTitle = "Charts";
        $rootScope.layout = $state.current.data.layout;


        if ($stateParams.projectID) {
            getChartData.getQuestionary($stateParams.projectID).then(function (response) {
                $scope.createDay = $filter("date")(response.createDate, 'yyyy-MM-dd');
                $scope.totalIntroduced = response.statistics.usersIntroduced;

                var startDayStr = $scope.createDay.split('-');
                $scope.startDayStr = startDayStr[1].substring(1) + '/' + startDayStr[0];
                console.log('new start day: ',startDayStr);
                console.log('create day', startDayStr);
                console.log($scope.startDayStr);

                $scope.uploadFile = function () {
                    var file = $scope.myFile;
                    var uploadUrl = "https://panel-repatriation.rhcloud.com/admin/uploadUsers/" + response.id;
                    fileUpload.uploadFileToUrl(file, uploadUrl);
                };
                // console.log(response);
                return response;

            }).then(function (response) {
                return getChartData.getAnalisys(response.id, $scope.userDay, $scope.createDay);
            }).then(function(response){

                function getGPA(questionID) {
                    return $http.get(url + '/common/getMonthlyCharts/' + questionID, config).then(function (response) {
                        console.log('date resp: ' ,response.data[$scope.startDayStr]);
                        var donutChart = c3.generate({
                            bindto: '#chart_gauge',
                            title: {
                                text: 'ממוצע שביעות רצון'
                            },
                            data: {
                                columns: [
                                    ['GPA', Math.round(response.data[$scope.startDayStr] * 100) / 100]
                                ],
                                type: 'gauge',
                                onclick: function (d, i) {
                                    $state.go('diagramsPage2', {projectID:$stateParams.projectID})
                                },
                                selection: {
                                    draggable: true
                                }
                            },
                            gauge: {
                                label: {
                                    format: function (value, ratio) {
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
                                pattern: ['#FF0000', '#F97600', '#F6C600', '#3aaef2'], // the three color levels for the percentage values.
                                threshold: {
                                    max: 5, // 100 is default
                                    values: [30, 60, 90, 100]
                                }
                            },
                            size: {
                                height: 180
                            }
                        });
                    })
                }



                console.log(response);
                getGPA(2);
                //charts page1 -> block1
                var chart = c3.generate({
                    title: {
                        text: 'התפלגות שביעות רצון מהשירות'
                    },
                    data: {
                        x: 'x',
                        columns: [
                            ['x', 'כלל לא שבע/ת רצון', 'די לא שבע/ת רצון', 'שבע/ת רצון במידה בינונית', 'דישבע/ת רצון', 'שבע/ת רצון במידה רבה מאוד'],
                            ['שבע/ת רצון', 0.01, 0.01, 0.14, 0.43, 0.45]
                        ],
                        type: 'bar'
                    },
                    axis: {
                        x: {
                            type: 'category'
                        },
                        y: {
                            tick: {
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

                //charts page1 -> block2
                var donutChart2 = c3.generate({
                    bindto: '#chart_gauge2',
                    title: {
                        text: 'ממוצע שביעות רצון'
                    },
                    data: {
                        columns: [
                            ['GPA', 4.6]
                        ],
                        type: 'gauge',
                        onclick: function (d, i) {
                            // $state.go('projects')
                        },
                        selection: {
                            draggable: true
                        }
                    },
                    gauge: {
                        label: {
                            format: function (value, ratio) {
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
                        pattern: ['#FF0000', '#F97600', '#F6C600', '#3aaef2'], // the three color levels for the percentage values.
                        threshold: {
                            max: 5, // 100 is default
                            values: [30, 60, 90, 100]
                        }
                    },
                    size: {
                        height: 180
                    }
                });
                var chart2 = c3.generate({
                    bindto: '#chart2',
                    title: {
                        text: 'התפלגות שביעות רצון מהשירות'
                    },
                    data: {
                        x: 'x',
                        columns: [
                            ['x', 'כלל לא שבע/ת רצון', 'די לא שבע/ת רצון', 'שבע/ת רצון במידה בינונית', 'דישבע/ת רצון', 'שבע/ת רצון במידה רבה מאוד'],
                            ['שבע/ת רצון', 0.03, 0.02, 0.26, 0.86, 0.54]
                        ],
                        type: 'bar'
                    },
                    axis: {
                        x: {
                            type: 'category'
                        },
                        y: {
                            tick: {
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

                //charts page1 -> block3
                var chart3 = c3.generate({
                    bindto: '#chart3',
                    title: {
                        text: 'גורמי אי-שביעות רצון'
                    },
                    data: {
                        x: 'x',
                        columns: [
                            ['x', 'מזמן הגעת הטכנאי לביתך', 'ממקצועיות הטכוני', 'מאדיבות ויחס הטכנו', 'אחר'],
                            ['שבע/ת רצון', 0.54, 0.31, 0.15, 0.01]
                        ],
                        type: 'bar'
                    },
                    axis: {
                        x: {
                            type: 'category'
                        },
                        y: {
                            tick: {
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
                            ratio: 0.7
                        }
                    },
                    size: {
                        height: 215
                    },
                    color: {
                        pattern: ['#B887AD']
                    }
                });
                var pieChart = c3.generate({
                    title: {
                        text: "אחוז סיום טיפול בפניות"
                    },
                    bindto: '#chart_gauge3',
                    data: {
                        // iris data from R
                        columns: [
                            ['הסתיים', 65],
                            ['לא הסתיים', 50]
                        ],
                        type: 'pie'
                        // onclick: function (d, i) { console.log("onclick", d, i); },
                        // onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                        // onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                    },
                    color: {
                        pattern: ['#01B8AA', '#FD625E']
                    },
                    size: {
                        height: 230
                    }
                });


                //charts page2 -> block1
                var chart4 = c3.generate({
                    bindto: '#chart2_1',
                    title: {
                        text: 'שביעות רצון ממוצעת - מוקדים'
                    },
                    data: {
                        x: 'x',
                        columns: [
                            ['x', 'שלוחת ק.שמונה', 'שלוחת חיפה', 'שלוחת אילת', 'מוקד ת"ב'],
                            ['שבע/ת רצון', 4.6, 2.9, 3.8, 4.2]
                        ],
                        type: 'bar',
                        selection: {
                            enabled: true
                        },
                        onclick: function (event) {
                            // console.log(event.value);
                            $state.go('diagramsPage2.diagramsPage3')
                        }
                    },
                    axis: {
                        x: {
                            type: 'category'
                        },
                        y: {
                            tick: {
                                // format: d3.format('%')
                                // values:[0.25,0.5,0.75,0.1]
                            },
                            max: 5,
                            min: 1,
                            padding: {
                                top: 10,
                                bottom: 0
                            }
                        }
                    },
                    bar: {
                        width: {
                            ratio: 0.3
                        }
                    },
                    size: {
                        height: 215
                    },
                    color: {
                        pattern: ['#61A0D7']
                    }
                });

                //charts page2 -> block2
                var chart5 = c3.generate({
                    bindto: '#chart2_2',
                    title: {
                        text: 'שביעות רצון ממוצעת - צוותים'
                    },
                    data: {
                        x: 'x',
                        columns: [
                            ['x', 'צוות חיים', 'צוות יואל', 'צוות איריס', 'צוות אלי'],
                            ['שבע/ת רצון', 2.6, 3.7, 4.5, 4.6]
                        ],
                        type: 'bar',
                        selection: {
                            enabled: true
                        },
                        onclick: function (event) {
                            // console.log(event.value);
                            $state.go('diagramsPage2.diagramsPage3')
                        }
                    },
                    axis: {
                        x: {
                            type: 'category'
                        },
                        y: {
                            tick: {
                                // format: d3.format('%')
                                // values:[0.25,0.5,0.75,0.1]
                            },
                            max: 5,
                            min: 1,
                            padding: {
                                top: 10,
                                bottom: 0
                            }
                        }
                    },
                    bar: {
                        width: {
                            ratio: 0.3
                        }
                    },
                    size: {
                        height: 215
                    },
                    color: {
                        pattern: ['#B887AD']
                    }
                });
            })
        }

        $scope.userDay = $filter("date")(Date.now(), 'yyyy-MM-dd') || $scope.userDate;




    }])
    .service('getChartData', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {

        var url = "https://panel-repatriation.rhcloud.com";
        var authorizationData = $rootScope.authorizationData;
        var config = {headers: {"Authorization": "Basic " + authorizationData}};

        var data = {};

        return {
            getQuestionary: function (projectID) {
                return $http.get(url + '/common/getQuestionary/' + projectID, config).then(function (response) {
                    return response.data;
                })
            },
            getAnalisys: function (questionaryID,userDate, createQuestionaryDate) {
                console.log('enter to the analisys block');
                var params = $.param({
                    create: createQuestionaryDate,
                    userDate: userDate
                });

                if (data[questionaryID]) {
                    return $q(function (resolve) {
                        resolve(data[questionaryID]);
                    });
                } else {
                    return $http.post(url + '/common/getAnalysis/' + questionaryID, params, config)
                        .then(function (response) {
                            // success callback
                            console.log('analitycs response: ', response.data);
                            data[questionaryID] = response.data;
                            return response.data;
                        })
                }
            }
        }

    }]);
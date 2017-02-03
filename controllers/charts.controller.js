/**
 * Created by Gladkov Kirill on 12/12/2016.
 */
angular.module('panelsApp').controller('ChartsCtrl', ['$scope', '$rootScope', '$state', '$filter', 'fileUpload', '$stateParams', 'getChartData', '$mdDialog', 'serviceButtons', 'dialogChartService',
        function($scope, $rootScope, $state, $filter, fileUpload, $stateParams, getChartData, $mdDialog, serviceButtons, dialogChartService) {

            $scope.chartsArray = [];

            $rootScope.headerTitle = "charts";
            $rootScope.layout = $state.current.data.layout; //-> show left side menu
            $rootScope.isUpload = false;
            $rootScope.employee = {};

            var stats = {};
            if ($stateParams.projectID) {
                var projectId = $stateParams.projectID;
            } // <-- take this projectID from project template and use it into request below

            if ($stateParams.projectName) {
                $scope.$parent.$parent.projectName = $stateParams.projectName;
            } // <-- if add this to root scope will be problems

            $scope.$on("$destroy", function() {
                $scope.$parent.$parent.projectName = "";
                console.log("EXITING");
            });


            $scope.$watchGroup(['dateStart', 'dateEnd'], function(newValues, oldValues) { //<-- watch input "to date". if it changed - send new req with a new date
                getChartData.getQuestionary(projectId)
                    .then(function(response) {

                        $scope.createDate = $filter("date")(newValues[0] || response.createDate, 'yyyy-MM-dd');
                        $scope.userDate = $filter("date")(newValues[1] || Date.now(), 'yyyy-MM-dd');
                        $scope.minFromDate = $filter("date")(response.createDate, 'yyyy-MM-dd');
                        $scope.maxFromDate = $scope.userDate;
                        $scope.minToDate = $scope.createDate;
                        $scope.maxToDate = $filter("date")(response.endDate || Date.now(), 'yyyy-MM-dd');
                        console.log('RESPONSE getQuestionary: ', response);

                        $scope.exportToXLS = function() {
                            return serviceButtons.exportToXLS($scope.createDate, $scope.userDate, response.id)
                        };

                        $scope.showtimeLineChart = function() {
                            serviceButtons.getScheduleIsFullyAnswered(response.id).then(function(response) {

                                var names = dialogChartService.getModalChartData(response).namesArr;
                                var val = dialogChartService.getModalChartData(response).valuesArr.map(function(item, i, arr) {
                                    return typeof item === "string" ? item : item / 100;
                                });
                                console.log("dates names: ", names);
                                console.log("dates values: ", val);

                                testBarChartDraw(names, val, "4_1");


                            });
                            $scope.showChartDialogDates();
                        };

                        return response;
                    })
                    .then(function(response) {
                        return getChartData.getAnalisys(response.id, $scope.createDate, $scope.userDate);

                    }).then(function(response) {
                        $scope.totalIntroduced = response.questionary.statistics.usersRespondented;
                        stats = response.questionary.statistics;

                        var questions = response.questionary.questions;
                        var usersResponded = response.countUserByDate;


                        for (var i = 0; i < questions.length; i++) {

                            if (questions[i].questionType == 1) {
                                var rating = [''];
                                var ratingTitles = ['x'];
                                var gpa = 0;
                                var questionID = questions[i].id;

                                for (var j = 0; j < questions[i].answers.length; j++) {
                                    // console.log(questions[i].answers[j].title + ' ',questions[i].answers[j].usersRespondented)
                                    gpa += questions[i].answers[j].usersRespondented * (j + 1);
                                    rating.push(((questions[i].answers[j].usersRespondented * 100) / usersResponded) / 100);
                                    ratingTitles.push(questions[i].answers[j].title);
                                }
                                //used Math.round to round up to 2 decimal
                                gpa = Math.round((gpa / usersResponded) * 100) / 100;
                            }
                            //------------------
                            if (questions[i].questionType == 2) {
                                var satisfiedRaiting = [''];
                                var satisfiedRaitingTitile = ['x'];
                                var satisfiedGPA = 0;
                                var pieColumns = [];
                                var pieColumnsElement = [];

                                for (var x = 0; x < questions[i].answers.length; x++) {
                                    // console.log(questions[i].answers[j].title + ' ',questions[i].answers[j].usersRespondented)
                                    satisfiedGPA += questions[i].answers[x].usersRespondented * (x + 1);
                                    satisfiedRaiting.push(((questions[i].answers[x].usersRespondented * 100) / usersResponded) / 100);
                                    satisfiedRaitingTitile.push(questions[i].answers[x].title);

                                    pieColumnsElement.push(questions[i].answers[x].title);
                                    pieColumnsElement.push(((questions[i].answers[x].usersRespondented * 100) / usersResponded) / 100);
                                    pieColumns.push(pieColumnsElement);
                                    pieColumnsElement = [];
                                }
                                //used Math.round to round up to 2 decimal
                                satisfiedGPA = Math.round((gpa / usersResponded) * 100) / 100;
                            }
                            //------------------
                            if (questions[i].questionType == 3) {
                                var diSatisfiedRaiting = [''];
                                var diSatisfiedRaitingTitle = ['x'];

                                for (var y = 0; y < questions[i].answers.length; y++) {
                                    // console.log(questions[i].answers[j].title + ' ',questions[i].answers[j].usersRespondented)
                                    diSatisfiedRaiting.push(((questions[i].answers[y].usersRespondented * 100) / usersResponded) / 100);
                                    diSatisfiedRaitingTitle.push(questions[i].answers[y].title);
                                }
                            }
                        }

                        var donutChart = c3.generate({
                            bindto: '#chart_gauge',
                            title: {
                                text: 'ממוצע שביעות רצון'
                            },
                            data: {
                                columns: [
                                    ['GPA', gpa]
                                ],
                                type: 'gauge',
                                onclick: function(d, i) {
                                    getChartData.getAnalisysDrillDown(questionID, $scope.createDate, $scope.userDate).then(function(response) {

                                        var citiesNames = dialogChartService.getModalChartData(response).namesArr;
                                        var citiesValues = dialogChartService.getModalChartData(response).valuesArr;

                                        c3.generate({
                                            bindto: '#chart2_1',
                                            title: {
                                                text: 'שביעות רצון ממוצעת - מוקדים'
                                            },
                                            data: {
                                                x: 'x',
                                                columns: [citiesNames, citiesValues],
                                                labels: {
                                                    format: function(v, id, i, j) {
                                                        return (v).toFixed(2);
                                                    }
                                                },
                                                type: 'bar',
                                                selection: {
                                                    enabled: true
                                                },
                                                onclick: function() {
                                                    var currCityID = arguments[0].x + 1;
                                                    getChartData.getAnalisysDrillDown(questionID, $scope.createDate, $scope.userDate, citiesNames[currCityID])
                                                        .then(function(response) {
                                                            var groupNames = dialogChartService.getModalChartData(response).namesArr;
                                                            var groupValues = dialogChartService.getModalChartData(response).valuesArr;

                                                            c3.generate({
                                                                bindto: '#chart2_2',
                                                                title: {
                                                                    text: 'שביעות רצון ממוצעת - צוותים'
                                                                },
                                                                data: {
                                                                    x: 'x',
                                                                    columns: [groupNames, groupValues],
                                                                    type: 'bar',
                                                                    selection: {
                                                                        enabled: true
                                                                    },
                                                                    labels: {
                                                                        format: function(v, id, i, j) {
                                                                            return (v).toFixed(2);
                                                                        }
                                                                    },
                                                                    onclick: function() {
                                                                        var currGroupID = arguments[0].x + 1;
                                                                        getChartData.getAnalisysDrillDown(questionID, $scope.createDate, $scope.userDate, citiesNames[currCityID], groupNames[currGroupID])
                                                                            .then(function(response) {

                                                                                var data = [];
                                                                                $("#table").html("");
                                                                                
                                                                                for (var key in response) {
                                                                                    data[0] = ["NAME"];
                                                                                    data.push([]);
                                                                                    data[data.length-1].unshift(key);
                                                                                    for (var innerKey in response[key]) {
                                                                                            data[0].unshift(innerKey.toUpperCase());
                                                                                            data[data.length-1].unshift(response[key][innerKey]);
                                                                                    }
                                                                                }

                                                                                var cityTable = makeTable($("#table"), data);
                                                                                console.log(response);
                                                                            });
                                                                    }
                                                                },
                                                                axis: {
                                                                    x: {
                                                                        type: 'category'
                                                                    },
                                                                    y: {
                                                                        max: 5,
                                                                        min: 0,
                                                                        padding: {
                                                                            top: 0,
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
                                                                    width: 600,
                                                                    height: 300
                                                                },
                                                                // color: {
                                                                //     pattern: ['#61A0D7']
                                                                // },
                                                                legend: {
                                                                    show: false
                                                                }
                                                            });

                                                        });
                                                }
                                            },
                                            axis: {
                                                x: {
                                                    type: 'category'
                                                },
                                                y: {
                                                    max: 5,
                                                    min: 0,
                                                    padding: {
                                                        top: 0,
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
                                                height: 300,
                                                width: 600
                                            },
                                            color: {
                                                pattern: ['#61A0D7']
                                            },
                                            legend: {
                                                show: false
                                            }
                                        });
                                    });
                                    $scope.showChartDialog();
                                }
                            },
                            gauge: {
                                label: {
                                    format: function(value, ratio) {
                                        return value
                                    },
                                    show: true // to turn off the min/max labels.
                                },
                                min: 1,
                                max: 5,
                                units: ''
                            },
                            color: {
                                pattern: ['#FF0000', '#F97600', '#F6C600', '#4FF239'],
                                threshold: {
                                    max: 5,
                                    values: [30, 60, 90, 100]
                                }
                            },
                            size: {
                                height: 200
                            }
                        });

                        var timeLineChart = c3.generate({
                            data: {
                                bindto: "#chart3_1",
                                columns: [
                                    ['data1', 300, 350, 300, 0, 0, 0],
                                    ['data2', 130, 100, 140, 200, 150, 50]
                                ],
                                types: {
                                    data1: 'area',
                                    data2: 'area-spline'
                                }
                            }
                        });
                        var pieChart = c3.generate({
                            title: {
                                text: "אחוז סיום טיפול בפניות"
                            },
                            bindto: '#chart_gauge3',
                            data: {
                                columns: pieColumns,
                                type: 'pie'
                            },
                            color: {
                                pattern: ['#01B8AA', '#FD625E', '#6E33B8']
                            },
                            size: {
                                height: 250
                            }
                        });

                        //charts page1 -> block1
                        barChartDraw(ratingTitles, rating);
                        //charts page1 -> block2
                        barChartDraw(ratingTitles, rating);
                        var donutChart2 = c3.generate({
                            bindto: '#chart_gauge2',
                            title: {
                                text: 'ממוצע שביעות רצון'
                            },
                            data: {
                                columns: [
                                    ['GPA', gpa]
                                ],
                                type: 'gauge'
                            },
                            gauge: {
                                label: {
                                    format: function(value, ratio) {
                                        return value
                                    },
                                    show: true // to turn off the min/max labels.
                                },
                                min: 1,
                                max: 5,
                                units: ''
                            },
                            color: {
                                pattern: ['#FF0000', '#F97600', '#F6C600', '#4FF239'],
                                threshold: {
                                    max: 5,
                                    values: [30, 60, 90, 100]
                                }
                            },
                            size: {
                                height: 200
                            }
                        });
                        //charts page1 -> block3
                        barChartDraw(diSatisfiedRaitingTitle, diSatisfiedRaiting, 3);


                        $scope.chartsArray = [];
                    });
            });

            function makeTable(container, data) {
                var table = $("<table/>").addClass('mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp');
                $.each(data, function(rowIndex, r) {
                    var row = $("<tr/>").addClass("tableTextCenter");
                    $.each(r, function(colIndex, c) {
                        row.append($("<t" + (rowIndex == 0 ? "h" : "d") + "/>").text(c));
                    });
                    table.append(row);
                });
                return container.append(table);
            }

            $scope.exportToPDF = function() {
                serviceButtons.exportToPDF();
            };
            $scope.showStat = function() {
                $scope.showDialog('templates/diagramsPageStat.html');
            };


            //-----------show dialogs functions----------//
            $scope.showDialog = function(tamplateUrl) {
                $mdDialog.show({
                    locals: {
                        translation: $scope.translation
                    },
                    controller: DialogController,
                    templateUrl: tamplateUrl,
                    parent: angular.element(document.body),
                    // targetEvent: d,
                    clickOutsideToClose: true,
                    fullscreen: false // Only for -xs, -sm breakpoints.

                });
            };
            $scope.showChartDialog = function() {
                $mdDialog.show({
                    controller: ChartsDialogController,
                    templateUrl: 'templates/diagramsPage2.html',
                    parent: angular.element(document.body),
                    // targetEvent: d,
                    clickOutsideToClose: true,
                    fullscreen: false // Only for -xs, -sm breakpoints.

                });
            };
            $scope.showChartDialogDates = function() {
                $mdDialog.show({
                    controller: ChartsDialogController,
                    templateUrl: 'templates/diagramsTimeLinePage.html',
                    parent: angular.element(document.body),
                    // targetEvent: d,
                    clickOutsideToClose: true,
                    fullscreen: false // Only for -xs, -sm breakpoints.

                });
            };

            //-----------draw charts function----------//
            function barChartDraw(namesArr, dataArr, questionaryType) {
                var colorScale = d3.scale.category10();

                var obj = {};
                obj.title = {};
                obj.data = {};
                obj.data.labels = {};
                obj.data.color;
                obj.axis = {};
                obj.axis.x = {};
                obj.axis.y = {};
                obj.axis.y.tick = {};
                obj.bindto = '#chart' + $scope.chartsArray.length;
                obj.title.text = 'התפלגות שביעות רצון מהשירות';
                obj.data.x = 'x';
                obj.data.columns = [namesArr, dataArr];
                obj.data.type = 'bar';
                obj.data.labels.format = function(v, id, i, j) {
                    return (v * 100).toFixed(0) + '%'
                };
                obj.axis.x.type = 'category';
                obj.axis.y.tick.format = d3.format('%');
                obj.axis.y.tick.values = [0.25, 0.5, 0.75, 1];
                obj.axis.y.padding = {};
                obj.axis.y.max = 1;
                obj.axis.y.min = 0;
                obj.axis.y.padding.top = 0;
                obj.axis.y.padding.bottom = 0;
                obj.bar = {};
                obj.bar.width = {};
                obj.bar.width.ratio = 0.6;
                obj.size = {};
                obj.legend = {};
                obj.color = {};
                obj.color.pattern = ['#3AAEF2'];
                obj.size.height = 215;
                obj.legend.show = false;

                if (questionaryType == 3) {
                    obj.data.color = function(inColor, data) {
                        if (data.index !== undefined) {
                            return colorScale(data.index);
                        }

                        return inColor;
                    };
                }
                var chart = c3.generate(obj);
                $scope.chartsArray.push(obj);
                return chart;
            }

            function testBarChartDraw(namesArr, dataArr, bindto, chartType, questionaryType) {
                var obj = {};
                obj.title = {};
                obj.data = {};
                obj.data.labels = {};
                obj.axis = {};
                obj.axis.x = {};
                obj.axis.y = {};
                obj.axis.y.tick = {};
                obj.bindto = '#chart' + bindto;
                obj.title.text = 'התפלגות שביעות רצון מהשירות';
                obj.data.x = 'x';
                obj.data.columns = [namesArr, dataArr];
                obj.data.type = chartType;
                obj.data.labels.format = function(v, id, i, j) {
                    return (v * 100).toFixed(0) + '%'
                };
                obj.axis.x.type = 'category';
                obj.axis.y.tick.format = d3.format('%');
                obj.axis.y.tick.values = [0.25, 0.5, 0.75, 1];
                obj.axis.y.padding = {};
                obj.axis.y.max = 1;
                obj.axis.y.min = 0;
                obj.axis.y.padding.top = 20;
                obj.axis.y.padding.bottom = 0;
                obj.bar = {};
                obj.bar.width = {};
                obj.bar.width.ratio = 0.6;
                obj.size = {};
                obj.legend = {};
                obj.color = {};
                obj.color.pattern = ['#3AAEF2'];
                obj.size.height = 215;
                obj.legend.show = false;

                var chart = c3.generate(obj);
                if (questionaryType == 3) {
                    setColumnBarColors(obj.bindto);
                }
                $scope.chartsArray.push(obj);
                return chart;
            }

            //-----------dialog window controllers----------//
            function DialogController($scope, $mdDialog, translation) {
                $scope.translation = translation;
                $scope.stats = stats;
                $scope.stats["responseRate"] = $scope.stats["responseRate"] + '%';

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

            function ChartsDialogController($scope, $mdDialog) {

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

        }
    ])
    .service('getChartData', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {

        var url = $rootScope.url;
        var authorizationData = $rootScope.authorizationData;
        var config = {
            headers: {
                "Authorization": "Basic " + authorizationData
            }
        };
        var analisysData = {};

        return {
            getQuestionary: function(projectID) {
                return $http.get(url + '/common/getQuestionary/' + projectID, config).then(function(response) {
                    return response.data;
                })
            },
            getAnalisys: function(questionaryID, startDate, endDate) {

                if (analisysData[questionaryID]) {
                    return $q(function(resolve) {
                        resolve(analisysData[questionaryID]);
                    });
                } else {
                    // here useud ajax request because the angular $http.post do not work (takes null) with server
                    return $.ajax({
                        url: url + '/common/getAnalysis/' + questionaryID,
                        type: 'post',
                        data: {
                            startDate: startDate,
                            endDate: endDate
                        },
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Basic ' + authorizationData
                        },
                        dataType: 'json',
                        success: function(response) {
                            analisysData[questionaryID] = response.data;
                            return response.data;
                        }
                    });

                }
            },
            getAnalisysDrillDown: function(questionID, startDate, endDate, city, group) {
                return $.ajax({
                    url: url + '/common/getAnalysisDrillDown/' + questionID,
                    type: 'post',
                    data: {
                        startDate: startDate,
                        endDate: endDate,
                        city: city,
                        group: group
                    },
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': 'Basic ' + authorizationData
                    },
                    dataType: 'json',
                    success: function(response) {
                        // analisysData[questionaryID] = response.data;
                        return response;
                    }
                });
            }
        };

    }])
    .service('serviceButtons', ['$rootScope', '$http', 'fileUpload', function($rootScope, $http, fileUpload) {

        var url = $rootScope.url;
        var authorizationData = $rootScope.authorizationData;
        var config = {
            headers: {
                "Authorization": "Basic " + authorizationData
            }
        };


        return {
            getScheduleIsFullyAnswered: function(questionaryID) {
                return $http.get(url + "/common/getScheduleIsFullyAnswered/" + questionaryID, config).then(function(response) {
                    return response.data;
                })
            },
            exportToPDF: function() {
                console.log("TRYING TO EXPORT");
                // window.open('', document.getElementById('toExportToPDF').toDataURL());


                var mywindow = window.open('', 'PRINT', 'height=800,width=1000');
                mywindow.id = "printMeToPDF";
                mywindow.document.write('<html><head><title>' + document.title + '</title>');
                mywindow.document.write('<style type="text/css">' + '.c3 svg{font:10px sans-serif;-webkit-tap-highlight-color:transparent}.c3 line,.c3 path{fill:none;stroke:#000}.c3 text{-webkit-user-select:none;-moz-user-select:none;user-select:none}.c3-bars path,.c3-event-rect,.c3-legend-item-tile,.c3-xgrid-focus,.c3-ygrid{shape-rendering:crispEdges}.c3-chart-arc path{stroke:#fff}.c3-chart-arc text{fill:#fff;font-size:13px}.c3-grid line{stroke:#aaa}.c3-grid text{fill:#aaa}.c3-xgrid,.c3-ygrid{stroke-dasharray:3 3}.c3-text.c3-empty{fill:gray;font-size:2em}.c3-line{stroke-width:1px}.c3-circle._expanded_{stroke-width:1px;stroke:#fff}.c3-selected-circle{fill:#fff;stroke-width:2px}.c3-bar{stroke-width:0}.c3-bar._expanded_{fill-opacity:.75}.c3-target.c3-focused{opacity:1}.c3-target.c3-focused path.c3-line,.c3-target.c3-focused path.c3-step{stroke-width:2px}.c3-target.c3-defocused{opacity:.3!important}.c3-region{fill:#4682b4;fill-opacity:.1}.c3-brush .extent{fill-opacity:.1}.c3-legend-item{font-size:12px}.c3-legend-item-hidden{opacity:.15}.c3-legend-background{opacity:.75;fill:#fff;stroke:#d3d3d3;stroke-width:1}.c3-title{font:14px sans-serif}.c3-tooltip-container{z-index:10}.c3-tooltip{border-collapse:collapse;border-spacing:0;background-color:#fff;empty-cells:show;-webkit-box-shadow:7px 7px 12px -9px #777;-moz-box-shadow:7px 7px 12px -9px #777;box-shadow:7px 7px 12px -9px #777;opacity:.9}.c3-tooltip tr{border:1px solid #CCC}.c3-tooltip th{background-color:#aaa;font-size:14px;padding:2px 5px;text-align:left;color:#FFF}.c3-tooltip td{font-size:13px;padding:3px 6px;background-color:#fff;border-left:1px dotted #999}.c3-tooltip td>span{display:inline-block;width:10px;height:10px;margin-right:6px}.c3-tooltip td.value{text-align:right}.c3-area{stroke-width:0;opacity:.2}.c3-chart-arcs-title{dominant-baseline:middle;font-size:1.3em}.c3-chart-arcs .c3-chart-arcs-background{fill:#e0e0e0;stroke:none}.c3-chart-arcs .c3-chart-arcs-gauge-unit{fill:#000;font-size:16px}.c3-chart-arcs .c3-chart-arcs-gauge-max,.c3-chart-arcs .c3-chart-arcs-gauge-min{fill:#777}.c3-chart-arc .c3-gauge-value{fill:#000} .c3-axis-y {display: none;}' + '</style>');
                mywindow.document.write('</head><body >');
                mywindow.document.write('<h1>' + document.title + '</h1>');

                // this thing need to be exported
                mywindow.document.write('<div id="pdfMe">');
                var mdlGrids = $('#toExportToPDF').find('.mdl-grid');
                // console.log(mdlGrids);


                var i, j, max = 0,
                    cnt;
                var mdlGridsSubDiv;

                for (i = 0; i < mdlGrids.length; i++) {

                    mdlGridsSubDiv = mdlGrids[i].childNodes;
                    cnt = 0;
                    for (j = 0; j < mdlGridsSubDiv.length; j++) {
                        if (mdlGridsSubDiv[j].innerHTML) {
                            cnt++;
                        }
                        max = max < cnt ? cnt : max;
                    }
                }

                for (i = 0; i < mdlGrids.length; i++) {
                    mywindow.document.write('<table>');

                    mywindow.document.write('<tr>');
                    mdlGridsSubDiv = mdlGrids[i].childNodes;
                    for (j = 0; j < mdlGridsSubDiv.length; j++) {

                        if (mdlGridsSubDiv[j].innerHTML) {
                            if (mdlGridsSubDiv[j].innerHTML.length < max) {
                                mywindow.document.write('<td colspan="' + max + '">');
                            } else {
                                mywindow.document.write('<td>');
                            }

                            mywindow.document.write(mdlGridsSubDiv[j].innerHTML);
                            mywindow.document.write('</td>');
                        }
                    }
                    mywindow.document.write('</tr>');
                    mywindow.document.write('</table>');
                }
                mywindow.document.write('</div>');
                // ==============================

                mywindow.document.write('</body></html>');
                mywindow.document.close(); // necessary for IE >= 10
                console.log(mywindow.document);
                mywindow.focus(); // necessary for IE >= 10*/
                mywindow.print();

                return true;


            },
            exportToXLS: function(startDate, endDate, questionaryID) {

                var dates = $.param({
                    startDate: startDate,
                    endDate: endDate
                });

                $http({
                        url: url + '/common/getReport3/' + questionaryID + '/xls',
                        method: "POST",
                        data: dates, //this is your json data string
                        headers: {
                            "Authorization": "Basic " + authorizationData,
                            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8;"
                        },
                        responseType: 'arraybuffer'
                    })
                    .then(function(resolve) {
                        console.log('excel DATA: -->:', resolve.data);
                        var blob = new Blob([resolve.data], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        });
                        saveAs(blob, "Report.xls");
                        window.close();
                    }, function(reject) {
                        console.log('excel error DATA: -->:', reject)
                    })
            },
            uploadFile: function(myFile, projectID, index) {
                var file = myFile;
                var uploadUrl = $rootScope.url + "/admin/uploadUsers/" + projectID;
                fileUpload.uploadFileToUrl(file, uploadUrl, index);
                $rootScope.isUpload = true;
            }
        }

    }])
    .service('dialogChartService', [function() {
        return {
            getModalChartData: function(response) {
                var namesArr = ['x'];
                var valuesArr = [''];
                for (var element in response) {
                    // console.log('group analisys', element);
                    // console.log('group values: ', response[element]);
                    namesArr.push(element);
                    valuesArr.push((response[element] * 100) / 100);
                }
                return {
                    namesArr: namesArr,
                    valuesArr: valuesArr
                }
            }
        }

    }]);
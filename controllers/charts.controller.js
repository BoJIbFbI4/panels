/**
 * Created by Gladkov Kirill on 12/12/2016.
 */
angular.module('panelsApp').controller('ChartsCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$state', '$filter', 'fileUpload', '$stateParams', 'getChartData',
    function ($scope, $rootScope, $http, $timeout, $state, $filter, fileUpload, $stateParams, getChartData) {


        $scope.surveyData = {};
        //
        $rootScope.headerTitle = "charts";
        $rootScope.layout = $state.current.data.layout;
        $rootScope.isUpload = false;

        var doc = new jsPDF();
        var specialElementHandlers = {
            '#editor': function (element, renderer) {
                return true;
            }
        };

        //TODO : MOVE THIS FUNCTION TO SERVICE
        $scope.exportToPDF = function () {
            console.log("TRYING TO EXPORT");
            // window.open('', document.getElementById('toExportToPDF').toDataURL());


            var mywindow = window.open('', 'PRINT', 'height=800,width=1000');
            mywindow.id = "printMeToPDF";
            mywindow.document.write('<html><head><title>' + document.title + '</title>');
            mywindow.document.write('<style type="text/css">' + '.c3 svg{font:10px sans-serif;-webkit-tap-highlight-color:transparent}.c3 line,.c3 path{fill:none;stroke:#000}.c3 text{-webkit-user-select:none;-moz-user-select:none;user-select:none}.c3-bars path,.c3-event-rect,.c3-legend-item-tile,.c3-xgrid-focus,.c3-ygrid{shape-rendering:crispEdges}.c3-chart-arc path{stroke:#fff}.c3-chart-arc text{fill:#fff;font-size:13px}.c3-grid line{stroke:#aaa}.c3-grid text{fill:#aaa}.c3-xgrid,.c3-ygrid{stroke-dasharray:3 3}.c3-text.c3-empty{fill:gray;font-size:2em}.c3-line{stroke-width:1px}.c3-circle._expanded_{stroke-width:1px;stroke:#fff}.c3-selected-circle{fill:#fff;stroke-width:2px}.c3-bar{stroke-width:0}.c3-bar._expanded_{fill-opacity:.75}.c3-target.c3-focused{opacity:1}.c3-target.c3-focused path.c3-line,.c3-target.c3-focused path.c3-step{stroke-width:2px}.c3-target.c3-defocused{opacity:.3!important}.c3-region{fill:#4682b4;fill-opacity:.1}.c3-brush .extent{fill-opacity:.1}.c3-legend-item{font-size:12px}.c3-legend-item-hidden{opacity:.15}.c3-legend-background{opacity:.75;fill:#fff;stroke:#d3d3d3;stroke-width:1}.c3-title{font:14px sans-serif}.c3-tooltip-container{z-index:10}.c3-tooltip{border-collapse:collapse;border-spacing:0;background-color:#fff;empty-cells:show;-webkit-box-shadow:7px 7px 12px -9px #777;-moz-box-shadow:7px 7px 12px -9px #777;box-shadow:7px 7px 12px -9px #777;opacity:.9}.c3-tooltip tr{border:1px solid #CCC}.c3-tooltip th{background-color:#aaa;font-size:14px;padding:2px 5px;text-align:left;color:#FFF}.c3-tooltip td{font-size:13px;padding:3px 6px;background-color:#fff;border-left:1px dotted #999}.c3-tooltip td>span{display:inline-block;width:10px;height:10px;margin-right:6px}.c3-tooltip td.value{text-align:right}.c3-area{stroke-width:0;opacity:.2}.c3-chart-arcs-title{dominant-baseline:middle;font-size:1.3em}.c3-chart-arcs .c3-chart-arcs-background{fill:#e0e0e0;stroke:none}.c3-chart-arcs .c3-chart-arcs-gauge-unit{fill:#000;font-size:16px}.c3-chart-arcs .c3-chart-arcs-gauge-max,.c3-chart-arcs .c3-chart-arcs-gauge-min{fill:#777}.c3-chart-arc .c3-gauge-value{fill:#000}' + '</style>');
            mywindow.document.write('</head><body >');
            mywindow.document.write('<h1>' + document.title + '</h1>');

            // this thing need to be exported
            mywindow.document.write('<div id="pdfMe">');
            var mdlGrids = $('#toExportToPDF').find('.mdl-grid');
            // console.log(mdlGrids);


            var i, j, max = 0, cnt;
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

            //
            // html2canvas(mywindow.getElementById("pdfMe"), {
            //     allowTaint : true,
            //     letterRendering : true,
            //     taintTest: true,
            //     onrendered : function (canvas) {
            //         console.log(canvas);
            //         var data = canvas.toDataURL();
            //
            //         var docDefinition = {
            //             content: [{
            //                 image: data,
            //                 width: 500
            //             }]
            //         };
            //         pdfMake.createPdf(docDefinition).download("Score_Details.pdf");
            //         theCanvas = canvas;
            //         theCanvas.toBlob(function(blob) {
            //             saveAs(blob, "Dashboard.png");
            //         });
            //     }
            // });


            mywindow.print();
            mywindow.close();

            return true;


        };


        if ($stateParams.projectID) { // <-- take this projectID from project template and use it into request below

            $scope.$watch('dateEnd', function (_data) { //<-- watch input "to date". if it changed - send new req with a new date

                getChartData.getQuestionary($stateParams.projectID).then(function (response) {
                    $scope.createDate = $filter("date")(response.createDate, 'yyyy-MM-dd');
                    $scope.userDate = $filter("date")(_data, 'yyyy-MM-dd') || $filter("date")(Date.now(), 'yyyy-MM-dd');
                    $scope.totalIntroduced = response.statistics.usersIntroduced;

                    // function for upload excel file with new users. Placed here because it use this questionary ID
                    $scope.uploadFile = function () {
                        var file = $scope.myFile;
                        var uploadUrl = $rootScope.url + "/admin/uploadUsers/" + response.id;
                        fileUpload.uploadFileToUrl(file, uploadUrl);
                        $rootScope.isUpload = true;
                    };

                    return response;

                }).then(function (response) {
                    return getChartData.getAnalisys(response.id, $scope.createDate, $scope.userDate);
                }).then(function (response) {

                    // put put response data to the charts
                    //TODO function --> get data for each chart using questionType as parameter

                    var rating = [''];
                    var ratingTitles = ['x'];
                    var gpa = 0;
                    var satisfiedGPA = 0;
                    var satisfiedRaiting = [''];
                    var questions = response.questionary.questions;
                    var usersResponded = response.countUserByDate;

                    for (var i = 0; i < questions.length; i++) {

                        if (questions[i].questionType == 1) {
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
                            for (var x = 0; x < questions[i].answers.length; x++) {
                                // console.log(questions[i].answers[j].title + ' ',questions[i].answers[j].usersRespondented)
                                satisfiedGPA += questions[i].answers[x].usersRespondented * (x + 1);
                                satisfiedRaiting.push(((questions[i].answers[x].usersRespondented * 100) / usersResponded) / 100);
                            }
                            //used Math.round to round up to 2 decimal
                            satisfiedGPA = Math.round((gpa / usersResponded) * 100) / 100;
                        }

                    }

                    console.log('rating charts data: ', rating);
                    console.log('request with dates: ', response);

                    //charts page1 -> block1
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
                            onclick: function (d, i) {
                                $state.go('diagramsPage2', {projectID: $stateParams.projectID})
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
                            pattern: ['#FF0000', '#F97600', '#F6C600', '#4FF239'], // the three color levels for the percentage values.
                            threshold: {
                                max: 5, // 100 is default
                                values: [30, 60, 90, 100]
                            }
                        },
                        size: {
                            height: 200
                        }
                    });
                    var chart = c3.generate({
                        title: {
                            text: 'התפלגות שביעות רצון מהשירות'
                        },
                        data: {
                            x: 'x',
                            columns: [
                                ratingTitles,
                                rating
                            ],
                            type: 'bar',
                            labels: {
                                format: function (v, id, i, j) {

                                    return (v * 100).toFixed(3) + '%';
                                }
                            }
                        },
                        axis: {
                            x: {
                                type: 'category'
                            },
                            y: {
                                tick: {
                                    format: d3.format('%'),
                                    values: [0.25, 0.5, 0.75, 1]
                                },
                                max: 1,
                                min: 0,
                                padding: {
                                    top: 0,
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
                        },
                        legend: {
                            show: false
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
                                ['GPA', satisfiedGPA]
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
                            pattern: ['#FF0000', '#F97600', '#F6C600', '#4FF239'], // the three color levels for the percentage values.
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
                                satisfiedRaiting
                            ],
                            type: 'bar',
                            labels: {
                                format: function (v, id, i, j) {

                                    return (v * 100).toFixed(3) + '%';
                                }
                            }
                        },
                        axis: {
                            x: {
                                type: 'category'
                            },
                            y: {
                                tick: {
                                    format: d3.format('%'),
                                    values: [0.25, 0.5, 0.75, 1]
                                },
                                max: 1,
                                min: 0,
                                padding: {
                                    top: 0,
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
                        },
                        legend: {
                            show: false
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
                });
            });
        }

    }])
    .service('getChartData', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {

        var url = $rootScope.url;
        var authorizationData = $rootScope.authorizationData;
        var config = {headers: {"Authorization": "Basic " + authorizationData}};

        var data = {};

        return {
            getQuestionary: function (projectID) {
                return $http.get(url + '/common/getQuestionary/' + projectID, config).then(function (response) {
                    return response.data;
                })
            },
            getAnalisys: function (questionaryID, startDate, endDate) {

                if (data[questionaryID]) {
                    return $q(function (resolve) {
                        resolve(data[questionaryID]);
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
                        success: function (response) {
                            data[questionaryID] = response.data;
                            return response.data;
                        }
                    });

                }
            }
        }

    }]);
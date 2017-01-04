/**
 * Created by Gladkov Kirill on 12/12/2016.
 */
angular.module('panelsApp').controller('ChartsCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$state', '$filter', 'fileUpload', '$stateParams', 'getChartData','$mdDialog',
    function ($scope, $rootScope, $http, $timeout, $state, $filter, fileUpload, $stateParams, getChartData, $mdDialog) {

        $scope.surveyData = {};
        //
        $rootScope.headerTitle = "charts";
        $rootScope.layout = $state.current.data.layout;
        $rootScope.isUpload = false;


        function DialogController($scope, $mdDialog) {
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
                }).then(function (response){

                    // put put response data to the charts
                    //TODO function --> get data for each chart using questionType as parameter

                    var rating = [''];
                    var satisfiedRaiting = [''];
                    var diSatisfiedRaiting = [''];
                    var ratingTitles = ['x'];
                    var satisfiedRaitingTitile = ['x'];
                    var diSatisfiedRaitingTitle = ['x'];
                    var gpa = 0;
                    var satisfiedGPA = 0;
                    var questions = response.questionary.questions;
                    var usersResponded = response.countUserByDate;
                    var columnColors = ['#9a4d6f', '#c76c47', '#f85115', '#d9b099', '#d4ba2f'];

                    for (var i = 0; i < questions.length; i++){

                        if (questions[i].questionType == 1){
                            for (var j = 0; j < questions[i].answers.length; j++){
                                // console.log(questions[i].answers[j].title + ' ',questions[i].answers[j].usersRespondented)
                                gpa += questions[i].answers[j].usersRespondented * (j + 1);
                                rating.push(((questions[i].answers[j].usersRespondented * 100) / usersResponded) / 100);
                                ratingTitles.push(questions[i].answers[j].title);
                            }
                            //used Math.round to round up to 2 decimal
                            gpa = Math.round((gpa / usersResponded) * 100) / 100;
                        }
                        //------------------
                        if (questions[i].questionType == 2){
                            for (var x = 0; x < questions[i].answers.length; x++){
                                // console.log(questions[i].answers[j].title + ' ',questions[i].answers[j].usersRespondented)
                                satisfiedGPA += questions[i].answers[x].usersRespondented * (x + 1);
                                satisfiedRaiting.push(((questions[i].answers[x].usersRespondented * 100) / usersResponded) / 100);
                                satisfiedRaitingTitile.push(questions[i].answers[x].title);
                            }
                            //used Math.round to round up to 2 decimal
                            satisfiedGPA = Math.round((gpa / usersResponded) * 100) / 100;
                        }
                        //------------------
                        if (questions[i].questionType == 3){
                            var pieColumns = [];
                            var pieColumnsElement = [];
                            for (var y = 0; y < questions[i].answers.length; y++){
                                // console.log(questions[i].answers[j].title + ' ',questions[i].answers[j].usersRespondented)
                                diSatisfiedRaiting.push(((questions[i].answers[y].usersRespondented * 100) / usersResponded) / 100);
                                diSatisfiedRaitingTitle.push(questions[i].answers[y].title);
                                pieColumnsElement.push(questions[i].answers[y].title);
                                pieColumnsElement.push(((questions[i].answers[y].usersRespondented * 100) / usersResponded) / 100);
                                pieColumns.push(pieColumnsElement);
                                pieColumnsElement = [];
                            }
                        }

                    }

                    console.log('rating charts data: ' ,rating);
                    console.log('request with dates: ',response);

                    console.log('pie columns: ',pieColumns);

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
                              //  $state.go('diagramsPage2', {projectID: $stateParams.projectID})
                              // TODO: Modal Charts Window

                                $mdDialog.show({
                                    controller: DialogController,
                                    templateUrl: 'templates/diagramsPage2.html',
                                    parent: angular.element(document.body),
                                    targetEvent: d,
                                    clickOutsideToClose:true,
                                    fullscreen: false // Only for -xs, -sm breakpoints.
                                })



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
                                    values:[0.25,0.5,0.75,1]
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
//                     var donutChart2 = c3.generate({
//                         bindto: '#chart_gauge2',
//                         title: {
//                             text: 'ממוצע שביעות רצון'
//                         },
//                         data: {
//                             columns: [
//                                 ['GPA', satisfiedGPA]
//                             ],
//                             type: 'gauge',
//                             onclick: function (d, i) {
//                                 // $state.go('projects')
//                             },
//                             selection: {
//                                 draggable: true
//                             }
//                         },
//                         gauge: {
//                             label: {
//                                 format: function (value, ratio) {
//                                     return value;
//                                 },
//                                 show: true // to turn off the min/max labels.
//                             },
//                             min: 1, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
//                             max: 5, // 100 is default
//                             units: ''
// //    width: 39 // for adjusting arc thickness
//                         },
//                         color: {
//                             pattern: ['#FF0000', '#F97600', '#F6C600', '#4FF239'], // the three color levels for the percentage values.
//                             threshold: {
//                                 max: 5, // 100 is default
//                                 values: [30, 60, 90, 100]
//                             }
//                         },
//                         size: {
//                             height: 180
//                         }
//                     });
                    var chart2 = c3.generate({
                        bindto: '#chart2',
                        title: {
                            text: 'התפלגות שביעות רצון מהשירות'
                        },
                        data: {
                            x: 'x',
                            columns: [
                                satisfiedRaitingTitile,
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
                                    values:[0.25,0.5,0.75,1]
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
                                diSatisfiedRaitingTitle,
                                diSatisfiedRaiting
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
                                    values:[0.25,0.5,0.75,0.1]
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
                        legend: {
                            show: false
                        }
                    });
                    var pieChart = c3.generate({
                        title: {
                            text: "אחוז סיום טיפול בפניות"
                        },
                        bindto: '#chart_gauge3',
                        data: {
                            // iris data from R
                            columns: pieColumns
                            ,
                            type: 'pie'
                            // onclick: function (d, i) { console.log("onclick", d, i); },
                            // onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                            // onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                        },
                        color: {
                            pattern: ['#01B8AA', '#FD625E', '#6E33B8']
                        },
                        size: {
                            height: 250
                        }
                    });
                    setColumnBarColors(columnColors, 'chart3');

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
                               // $state.go('diagramsPage2.diagramsPage3')





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

        //setup colored chart
        function setColumnBarColors(colors, chartContainer) {

            $('#' + chartContainer + ' .c3-chart-bars .c3-shape').each(function(index) {
                this.style.cssText += 'fill: ' + colors[index] + ' !important; stroke: ' + colors[index] + '; !important';
            });

            $('#' + chartContainer + ' .c3-chart-texts .c3-text').each(function(index) {
                this.style.cssText += 'fill: ' + colors[index] + ' !important;';
            });
        }

    }])
    .service('getChartData', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {

        var url = $rootScope.url;
        var authorizationData = $rootScope.authorizationData;
        var config = { headers: {"Authorization": "Basic " + authorizationData} };

        var data = {};

        return {
            getQuestionary: function (projectID) {
                return $http.get(url + '/common/getQuestionary/' + projectID, config).then(function (response) {
                    return response.data;
                })
            },
            getAnalisys: function (questionaryID, startDate,  endDate) {

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
                        headers: {'Content-Type': undefined,
                                  'Authorization': 'Basic ' + authorizationData},
                        dataType: 'json',
                        success: function (response) {
                            data[questionaryID] = response.data;
                            return response.data;
                        }
                    });

                }
            }
    };

    }]);



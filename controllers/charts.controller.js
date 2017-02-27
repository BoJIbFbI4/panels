/**
* Created by Gladkov Kirill on 12/12/2016.
*/

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


angular.module('panelsApp').controller('ChartsCtrl', ['$scope', '$rootScope', '$state', '$filter', 'fileUpload', '$stateParams', 'getChartData', '$mdDialog', 'serviceButtons', 'dialogChartService',
function($scope, $rootScope, $state, $filter, fileUpload, $stateParams, getChartData, $mdDialog, serviceButtons, dialogChartService) {


  generateChartFromObject =  function (qResultsFormatted){
    // console.log(JSON.stringify(qResultsFormatted));
    var chartsGridContainer = document.getElementById("gridedCharts");
    var chartsGridContainerAngulared = angular.element(chartsGridContainer);
    chartsGridContainerAngulared.html("");

    for (var key=0 ; key < qResultsFormatted.length; key++){
      {
        var newDiv = angular.element('<div></div>');
        newDiv.addClass('mdl-cell--'+ qResultsFormatted[key].size +'-col');
        // newDiv.addClass('mdl-card');
        newDiv.addClass('chartsCard');
        newDiv.addClass('mdl-grid');
        newDiv.addClass('mdl-shadow--2dp');
        newDiv.addClass('chartsBack');


        // newDiv.addClass('mdl-button');
        var newHead = angular.element('<div></div>');
        newHead.text(qResultsFormatted[key].title);
        newHead.addClass('mdl-cell--'+ qResultsFormatted[key].titleSize +'-col');
        newHead.addClass('mdl-layout-title');
        newHead.addClass('header-border-bottom');

        // newHead.addClass('diklaHeader');
        var newId = 'chartNum_' + key
        var newChart = angular.element('<div id = "'+newId+'" ></div>');
        newChart.text(qResultsFormatted[key].value);
        newChart.addClass('mdl-cell--'+ qResultsFormatted[key].contentSize +'-col');
        newChart.addClass('mdl-layout-title');
        newChart.addClass('diklaHeader');


        var newDivider = angular.element('<div></div>');
        if (qResultsFormatted[key].titleSize > qResultsFormatted[key].contentSize){
          newDiv.append(newChart);
          newDiv.append(newHead);
        }else{
          newDiv.append(newHead);
          newDiv.append(newChart);
        }

      }
      chartsGridContainerAngulared.append(newDiv);
      generateSingleChart(qResultsFormatted[key], newId);
    }
  }
  generateSingleChart = function(qChart, newId){
    if (qChart.type=='gauge'){
      var gaugeQuastionId = qChart.questionID;
      // console.log(qChart.questionID, gaugeQuastionId);

      var chart = c3.generate({
        bindto: '#'+newId,
        data: {
          columns: [
            ['data', qChart.value]
          ],
          type: 'gauge',
          onclick: function(d, i) {
            console.log(key, gaugeQuastionId);

            getChartData.getAnalisysDrillDown(gaugeQuastionId, $scope.createDate, $scope.userDate)
            .then(function(response){

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
                    getChartData.getAnalisysDrillDown(gaugeQuastionId, $scope.createDate, $scope.userDate, citiesNames[currCityID])
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
                            getChartData.getAnalisysDrillDown(gaugeQuastionId, $scope.createDate, $scope.userDate, citiesNames[currCityID], groupNames[currGroupID])
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
            })
            $scope.showChartDialog();
          },
        },

        gauge: {
          label: {
            format: function(value, ratio) {
              return value;
            },
            show: false // to turn off the min/max labels.
          },
          min: qChart.minValue, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
          max: qChart.maxValue, // 100 is default
          units: qChart.units
          //    width: 39 // for adjusting arc thickness
        },
        color: {
          pattern: [
            '#FF0000',
            '#F97600',
            '#F6C600',
            '#60B044'], // the three color levels for the percentage values.
            threshold: {
              //            unit: 'value', // percentage is default
              max: qChart.maxValue, // 100 is default
              values: [30, 60, 90, 100]
            }
          },
          size: {
            height: 200
          }
        });
      }
      if (qChart.type=='bar'){
        var colorScale = d3.scale.category10();

        var chart = c3.generate({
          legend: {show:false},
          bindto: '#'+newId,
          axis:{
            x:{
              type : 'category'
            },
            y:{
              tick:{
                format:d3.format('%'),
                values:[0.25,0.5,0.75,1]
              },

              padding : {
                top : 0,
                bottom : 0
              },
              min:0,
              max:1
            }
          },
          color:{
            pattern:['#00C0AD']
          },
          data: {
            x:"x",
            columns: [
              qChart.answerTitles,
              qChart.answerValues
            ],
            labels:{format:function(v,id,i,j){return (v*100).toFixed(0)+" %"}},
            type: 'bar',

            selection:{enabled:true},
            color : qChart.color
          },
          bar: {
            width: {ratio: 0.8 }            //width: 100 // this makes bar width 100px
          },
          size: {
            height: 180
          }
        });
      }
      if (qChart.type=='pie'){
        var chart = c3.generate({
          bindto: '#'+newId,
          data: {
            // iris data from R
            columns: qChart.answerValues,
            type : 'pie'

          },
          size: {
            height: 250
          },
          color:{pattern:[
            "#01B8AA",
            '#FD625E',
            "#6E33B8"]}
          });
        }
      }

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

      $scope.$on("$destroy", function() { $scope.$parent.$parent.projectName = "";  });

      $scope.$watchGroup(['dateStart', 'dateEnd'], function(newValues, oldValues) { //<-- watch input "to date". if it changed - send new req with a new date
      getChartData.getQuestionary(projectId)
      .then(function(response) {
        // console.log('RESPONSE getQuestionary: ', response);
        $scope.createDate = $filter("date")(newValues[0] || response.createDate, 'yyyy-MM-dd');
        $scope.userDate = $filter("date")(newValues[1] || Date.now(), 'yyyy-MM-dd');
        $scope.minFromDate = $filter("date")(response.createDate, 'yyyy-MM-dd');
        $scope.maxFromDate = $scope.userDate;
        $scope.minToDate = $scope.createDate;
        $scope.maxToDate = $filter("date")(response.endDate || Date.now(), 'yyyy-MM-dd');
        $scope.exportToXLS = function() {
          return serviceButtons.exportToXLS($scope.createDate, $scope.userDate, response.id)
        };
        $scope.showtimeLineChart = function() {
          serviceButtons.getScheduleIsFullyAnswered(response.id).then(function(response) {

            var names = dialogChartService.getModalChartData(response).namesArr;
            var val = dialogChartService.getModalChartData(response).valuesArr.map(function(item, i, arr) {
              return typeof item === "string" ? item : item / 100;
            });
            // console.log("dates names: ", names);
            // console.log("dates values: ", val);
            //
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

        // this is a big plug
        // TODO : Need to reformat output from server to structured JSON
        // DOING NOW IS MOCKUP !!!
        var qResultsFormatted = [];
        var chartsOnPage = [];

        // console.log("gettingAnalisysData",response);
        var questions = response.questionary.questions;
        if (questions){
          if (questions.length != 0){
            for(key in questions){
              if(questions[key].questionType == 1 || (
                questions[key].questionType == 2 &&
                questions[key].answers.length > 2
              )){
                var resultType = "";
                var answerTitles =["x"];
                var answerValues =[""];
                var question = response.questionary.questions[key];
                var answersCount = 0;
                var answersAvg = 0;
                var answersSum = 0;
                for(answer in question.answers){
                  // console.log("APPLY CHART for ", key, answer, question.answers[answer].usersRespondented);

                  answerTitles[answer] = question.answers[answer].title;// + " \n(" + question.answers[answer].usersRespondented + ")";
                  answerValues[answer] = question.answers[answer].usersRespondented / response.countUserByDate ;
                  answersCount++;
                  answersSum+=question.answers[answer].usersRespondented * answersCount;
                  // console.log(answersCount,answersSum);
                }
                answerTitles.unshift("x");
                answerValues.unshift("");
                answersAvg = (answersSum / response.countUserByDate).toFixed(2) ;
                var qResultsFormattedNew = {
                  // size following to grid
                  "size": 8,
                  // size following to inner grid
                  "titleSize": 12,
                  "contentSize": 12,
                  "type": "bar",
                  "title": question.title,
                  "value": question.value,
                  "answerTitles": answerTitles,
                  "answerValues": answerValues,

                  "minValue" : 0.0,
                  "maxValue" : 100.0,
                  "units"    : '%',
                  "questionID":question.id
                };
                if(question.questionType == 2){
                  var colorScale = d3.scale.category10();
                  qResultsFormattedNew.color = function(inColor, data){
                    if (data.index!=undefined){
                      return colorScale(data.index)
                    }
                    return inColor;
                  }
                }
                qResultsFormatted.push(qResultsFormattedNew);

                if(question.questionType != 2){
                  var qResultsFormattedNewGauge = {}
                  {
                    qResultsFormattedNewGauge.size=4;
                    qResultsFormattedNewGauge.titleSize=12;
                    qResultsFormattedNewGauge.contentSize=12;
                    qResultsFormattedNewGauge.value = answersAvg;
                    qResultsFormattedNewGauge.type = "gauge";
                    qResultsFormattedNewGauge.minValue = 1;
                    qResultsFormattedNewGauge.maxValue = answersCount;
                    qResultsFormattedNewGauge.units = "";
                    qResultsFormattedNewGauge.questionID=question.id;
                    // console.log(question.id, qResultsFormattedNewGauge.questionID);
                    qResultsFormatted.push(qResultsFormattedNewGauge);
                  }
                }
              }

              if(response.questionary.questions[key].questionType == 4){
                // console.log(response.questionary.questions[key].questionType);
              }
              if(response.questionary.questions[key].questionType == 3){
                // console.log(response.questionary.questions[key].questionType);
              }
              if(response.questionary.questions[key].questionType == 2 && response.questionary.questions[key].answers.length == 2){
                // console.log(response.questionary.questions[key].questionType);
                var question = response.questionary.questions[key]
                // var answerTitles =["x"];
                var answerValues =[];
                for(answer in question.answers){
                  // console.log("APPLY CHART for ", key, answer, question.answers[answer].usersRespondented);
                  answerValues[answer] = [
                    question.answers[answer].title,
                    (question.answers[answer].usersRespondented / response.countUserByDate).toFixed(2) - 0
                  ];// + " \n(" + question.answers[answer].usersRespondented + ")";
                  // answerValues[answer] = question.answers[answer].usersRespondented / response.countUserByDate ;
                  // console.log(answersCount,answersSum);
                  // console.log(JSON.stringify(answerValues));
                }
                // console.log("answerValues");
                // console.log(answerValues);
                // console.log(JSON.stringify(answerValues));
                var qResultsFormattedNew = {
                  // size following to grid
                  "size": 4,
                  // size following to inner grid
                  "titleSize": 12,
                  "contentSize": 12,
                  "type": "pie",
                  "title": question.title,
                  "answerValues": answerValues,
                  "questionID":question.id
                };

                qResultsFormatted.push(qResultsFormattedNew);
              }


            }
            // console.log(JSON.stringify(qResultsFormatted));
            // console.log(JSON.stringify(qResultsFormatted));
            generateChartFromObject(qResultsFormatted);
          }
        }
        if (response.questionaryResult != null){
          var chartsCount = 0
          for (key in response.questionaryResult){
            qResultsFormatted[chartsCount] = {
              // size following to grid
              "size": 4,
              // size following to inner grid
              "titleSize": 12,
              "contentSize": 12,

              "type": "gauge",
              "title": key,
              "value": response.questionaryResult[key],

              "minValue" : 0.0,
              "maxValue" : 10.0,
              "units"    : ''

            }
            chartsCount++
          }
          // console.log(JSON.stringify(qResultsFormatted));

          qResultsFormatted[0].size = 6
          qResultsFormatted[0].type = 'simpleNumber'

          qResultsFormatted[1].size = 6

          qResultsFormatted[2].size = 12
          qResultsFormatted[2].titleSize = 8
          qResultsFormatted[2].contentSize = 4
          qResultsFormatted[2].type = 'simpleNumber'


          qResultsFormatted[6].size = 12
          qResultsFormatted[6].titleSize = 8
          qResultsFormatted[6].contentSize = 4
          qResultsFormatted[6].type = 'simpleNumber'

          qResultsFormatted[10].size = 12
          qResultsFormatted[10].titleSize = 8
          qResultsFormatted[10].contentSize = 4
          qResultsFormatted[10].type = 'simpleNumber'

          qResultsFormatted[11].size = 6

          qResultsFormatted[12].size = 6

          chartsCount = 0
          generateChartFromObject(qResultsFormatted)
        }
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
      obj.data.labels.format = function(v, id, i, j) {return (v * 100).toFixed(0) + '%'};
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
      // console.log(obj);
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
  }])
  .service('getChartData', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {

    var url = $rootScope.url;
    var authorizationData = $rootScope.authorizationData;
    var config = {
      headers: {
        "Authorization": "Basic " + authorizationData
      }
    };
    var analisysData = {};
    if (authorizationData == undefined){
      console.log(authorizationData);
      console.log("Companies auth data lost");
      // $state.go("auth");
      $rootScope.logout();
    }
    if (authorizationData == ""){
      // console.log(authorizationData);
      // console.log("Companies auth data empty");
      // $state.go("auth");
      $rootScope.logout();
    }

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
        console.log(url + '/common/getAnalysisDrillDown/' + questionID);
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
            console.log(response);
            return response;
          },
          error: function(error){
            console.log(error);
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

        // cnt = document.getElementById("toExportToPDF").innerHTML



        var allDivs = $('.chartsBack')
        var divsContainer = $('#toExportToPDF').find(allDivs)
        // var divsContainer = angular.element( document.querySelector( '#toExportToPDF' ) );
        var divs = divsContainer


        console.log("___");
        // var pdf = new jsPDF('p', 'pt', 'letter');
        //
        // pdf.canvas.height = 72 * 11;
        // pdf.canvas.width = 72 * 8.5;
        // html2pdf(cnt, pdf, function(pdf){
        //   // var iframe = document.createElement('iframe');
        //   // iframe.setAttribute('style','position:absolute;right:0; top:0; bottom:0; height:100%; width:500px');
        //   // document.body.appendChild(iframe);
        //   // iframe.src = pdf.output('datauristring');
        //   var cntPdf = pdf.output('datauristring');
        //   var lnk2pdf = document.getElementById('pdfMe');
        //   lnk2pdf.setAttribute("href",cntPdf)
        // });
        //

        var newTable = "<table><tr>"
        // for (i = 0; i < divs.length; length++) {
        //   console.log(i);
        // }


        console.log(divs.length);
        var counter = 0;
        for (var i=0 ; i<divs.length ; i++){
          var myClass = divs[i].getAttribute('class');
          console.log(myClass);

          newTable = newTable + "<td"
          if (myClass.includes("mdl-cell--8")){
            counter+=8
            newTable=newTable + " colspan=8>"
          }
          if (myClass.includes("mdl-cell--4")){
            counter+=4
            newTable=newTable + " colspan=4>"
          }
          if (myClass.includes("mdl-cell--6")){
            counter+=6
            newTable=newTable + " colspan=6>"
          }

          if (myClass.includes("mdl-cell--3")){
            counter+=3
            newTable=newTable + " colspan=3>"
          }

          if (myClass.includes("mdl-cell--12")){
            counter+=12
            newTable=newTable + " colspan=12>'"
          }
          newTable = newTable + "<div chartsCard mdl-grid mdl-shadow--2dp chartsBack>"
          newTable = newTable + divs[i].innerHTML
          if (myClass.includes("12")){
            counter+=12
            newTable=newTable + "</div>'"
          }

          newTable = newTable + "</td>"
          if (counter >= 12 ){
            newTable=newTable+"</tr><tr>"
            counter=0
          }


        }
        newTable = newTable + "</tr></table>"
        console.log(newTable);

        {
          var mywindow = window.open('','','left=50,top=50,width=800,height=640,toolbar=0,scrollbars=1,status=0');
          mywindow.id = "printMeToPDF";
          mywindow.document.write('<html>');
          // mywindow.document.write('<html><head><title>' + document.title + '</title>');
          mywindow.document.write('<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">        <link rel="stylesheet" href="./resources/mdl/material.css">        <link rel="shortcut icon" type="image/x-icon" href="favicon.ico?">        <link rel="stylesheet" href="assets/styles/style.css">        <link rel="stylesheet" href="assets/styles/paletteBlueGreyMD.css">    <link rel="stylesheet" href="resources/mdl/mdl-date/mdl-date-textfield.min.css">        <link rel="stylesheet" href="resources/c3/c3.min.css">        <link rel="stylesheet" href="assets/styles/auth.css">        <link rel="stylesheet" href="assets/styles/bootloader.css">        <link rel="stylesheet" href="assets/styles/loginLoaderProcessBar.css">        <link rel="stylesheet" href="assets/styles/attachExcelAnimation.css">        <link rel="stylesheet" href="assets/styles/statsTableStyle.css">        <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.css">');
          // mywindow.document.write('</head><body >');
          mywindow.document.write('<body onload=printMe()>');
          // mywindow.document.write('<h1>' + document.title + '</h1>');

          // this thing need to be exported
          mywindow.document.write('<div id="pdfMe">');
          mywindow.document.write(newTable);
          mywindow.document.write('</div>');
          // ==============================

          mywindow.document.write('<script> function printMe() {window.print(); } </script>');
          mywindow.document.write('</body></html>');

          mywindow.document.close(); // necessary for IE >= 10
          mywindow.focus(); // necessary for IE >= 10*/

          // mywindow.print();
          // mywindow.close();
        }
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
    }}])
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

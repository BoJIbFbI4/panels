(function () {
    'use strict';
    angular.module('panelsApp')
        .service('getChartData', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {

            var url = $rootScope.url;
            var authorizationData = $rootScope.authorizationData;
            var config = {
                headers: {
                    "Authorization": "Basic " + authorizationData
                }
            };
            var analisysData = {};
            var questionary = {};
            if (authorizationData == undefined) {
                console.log(authorizationData);
                console.log("Companies auth data lost");
                // $state.go("auth");
                $rootScope.logout();
            }
            if (authorizationData == "") {
                // console.log(authorizationData);
                // console.log("Companies auth data empty");
                // $state.go("auth");
                $rootScope.logout();
            }

            return {
                getQuestionary: function (projectID) {

                    return questionary
                        ? $http.get(url + '/common/getQuestionary/' + projectID, config).then(function (response) {
                            questionary = response.data;
                            return response.data;
                        })
                        : questionary;
                },
                getAnalisys: function (questionaryID, startDate, endDate) {

                    if (analisysData[questionaryID]) {
                        return $q(function (resolve) {
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
                            success: function (response) {
                                analisysData[questionaryID] = response.data;
                                return response.data;
                            }
                        });

                    }
                },
                getAnalisysDrillDown: function (questionID, startDate, endDate, city, group, answerID) {
                    // console.log(url + '/common/getAnalysisDrillDown/' + questionID);
                    return $.ajax({
                        // url: url + '/common/getAnalysisDrillDown/' + questionID,
                        url: url + '/common/getAnalysisDrillDown/',
                        type: 'post',
                        data: {
                            idQuestion: questionID,
                            idAnswer: answerID,
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
                        success: function (response, req) {
                            // console.log(req);
                            // analisysData[questionaryID] = response.data;
                            // console.log(response);
                            return response;
                        },
                        error: function (error) {
                            console.log(error);
                        }

                    });
                },
                getAnalisysDrillDownDickla: function (questionID, startDate, endDate, city, group) {
                    console.log(url + '/common/getAnalysisDrillDownDikla/');
                    return $.ajax({
                        url: url + '/common/getAnalysisDrillDownDikla/',
                        type: 'post',
                        data: {
                            startDate: startDate,
                            endDate: endDate,
                            city: city,
                            group: group,
                            title: questionID
                        },
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Basic ' + authorizationData
                        },
                        dataType: 'json',
                        success: function (response, req) {
                            console.log(req);
                            // analisysData[questionaryID] = response.data;
                            console.log('dikla response');
                            console.log(response);
                            return response;
                        },
                        error: function (error) {
                            console.log(error);
                        }

                    });

                },
            };

        }])

}());

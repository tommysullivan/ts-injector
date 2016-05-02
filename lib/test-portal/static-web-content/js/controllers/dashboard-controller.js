/**
 * Created by kvosoughi on 4/11/16.
 */

'use strict';

/**
 * @name DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the Automated Test Explorer
 */

angular.module('testPortalControllers').controller('DashboardCtrl', function (
        $scope, $rootScope, $http, $q, $location, $anchorScroll, TestResult, statusesModel, pieChart, summaryModel) {
        var testResultsPath = 'test-results/';
        var originalTestResults = [];
        $scope.testResults = []
        $scope.testResultsLoaded = false;
        $scope.statuses = statusesModel.allStatuses;
        $scope.hideJQL = true;

    $scope.onDisplayTab = function(tabname) {
        var tab_grid = $('.tab-grid'),
            tab_list = $('.tab-list');
        if(tabname == 'grid') {
            tab_list.hide();
            tab_grid.show( "slow", function() {
                // Animation complete.
            });
        } else {
            tab_grid.hide();
            tab_list.show( "slow", function() {
                // Animation complete.
            });
        }
    }

    function featureSummaries() {
        return {
            summaries: $scope.testResults.map(t=>t.featuresSummary()),
            times:  $scope.testResults.map(t=>t.modifiedTime)
        };
    }

    function bindPieChart() {
        $scope.aggregateSummary = summaryModel.aggregateSummary(featureSummaries().summaries, 'features');
        $scope.summaryPieChart = pieChart.forSummary($scope.aggregateSummary);
    }

    function formattedDate(epochTime) {
        var d = new Date(epochTime);
        return (d.getMonth() + 1) + '/' + d.getDate() + '/'
            +  d.getFullYear() + ' - ' + d.getHours()
            + ':' +  d.getMinutes();
    }

    function normalizeData() {
        var dates = $scope.testResults.map(t=>formattedDate(t.modifiedTime)),
            times = $scope.testResults.map(t=>t.modifiedTime);
        dates.reverse();
        var summaries = featureSummaries().summaries;
        var times = featureSummaries().times;
        summaries.reverse();

        $scope.testResultStatusesOverTimeChart = {
            labels: dates,
            times: times,
            series: $scope.statuses.map(s=>s.name),
            colours: $scope.statuses.map(s=>s.color),
            data: $scope.statuses.map(s=>{
                return summaries.map(f => f[s.name]);
            })
        }
    }

    function bindQueryBar() {
        $scope.statusDisplayName = statusesModel.statusDisplayName.bind(statusesModel);
        $scope.query = {
            automationRadio: 'automatedAndManual',
            showCasesWithMissingJIRAOnly: false,
            tagQuery: null
        }
        $scope.applyQuery = function() {
            var query = {
                hasOneOfTheseTags: $scope.query.tagQuery == null ? [] : $scope.query.tagQuery.split(/[ ]+/),
                includeTheseStatuses: $scope.statuses.filter(s=>s.selected).map(s=>s.name),
                automationType: $scope.query.automationRadio,
                showCasesWithMissingJIRAOnly: $scope.query.showCasesWithMissingJIRAOnly
            }
            var filteredTestResults = originalTestResults.map(
                testResult => testResult.filter(query)
            )
            $scope.testResults = filteredTestResults.filter(t => t.features.length > 0);
            $scope.testResults.reverse();
            normalizeData();
            setTimeout(()=>{
                $rootScope.$broadcast('applydata', {
                    testResults:$scope.testResults,
                    testResultStatusesOverTimeChart:$scope.testResultStatusesOverTimeChart,
                    summaryPieChart:$scope.summaryPieChart
                });
            } ,500);
        }
        $scope.applyQuery();
    }

    setTimeout(()=> {
        $scope.onDisplayTab('grid');
    },300);



    $http.get(testResultsPath).then(response => {
            var testResultLinksJSON = response.data;
            var testResultRequests = testResultLinksJSON.map((testResultLinkJSON, i) => {
                var url = testResultsPath + testResultLinkJSON.href;
                return $http.get(url, {headers: {Accept: 'application/json'}}).then(testResultResponse => {
                    var testResult = TestResult.fromJSON(
                        testResultResponse.data,
                        testResultLinkJSON.name,
                        url,
                        testResultLinkJSON.modifiedTime
                    )
                    $scope.testResults[i]=testResult;
                });
            });
            $q.all(testResultRequests).then(() => {
                originalTestResults = $scope.testResults;
                $scope.testResultsLoaded = true;
                bindQueryBar();
                bindPieChart();
                // broadcast apply event
                setTimeout(()=>{
                    $rootScope.$broadcast('applydata', {
                     testResults:$scope.testResults,
                     testResultStatusesOverTimeChart:$scope.testResultStatusesOverTimeChart,
                     summaryPieChart:$scope.summaryPieChart
                     });
                } ,500);
            });
        });
    }
);

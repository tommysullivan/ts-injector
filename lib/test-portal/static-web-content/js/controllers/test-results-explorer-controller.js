angular.module('testPortalControllers').controller('TestResultsExplorerController', function (
    $scope, $http, $q, $location, $anchorScroll, TestResult, statusesModel, pieChart, summaryModel) {
        var testResultsPath = 'test-results/';
        var originalTestResults = []

        $scope.testResults = []
        $scope.testResultsLoaded = false;
        $scope.statuses = statusesModel.allStatuses;

        function featureSummaries() { return $scope.testResults.map(t=>t.featuresSummary()); }

        function bindPieChart() {
            $scope.aggregateSummary = summaryModel.aggregateSummary(featureSummaries(), 'features');
            $scope.summaryPieChart = pieChart.forSummary($scope.aggregateSummary);
        }

        function formattedDate(epochTime) {
            var d = new Date(epochTime);
            return (d.getMonth() + 1) + '/' + d.getDate() + '/'
                   +  d.getFullYear() + ' - ' + d.getHours()
                   + ':' +  d.getMinutes();
        }

        function bindLineGraph() {
            var dates = $scope.testResults.map(t=>formattedDate(t.modifiedTime));
            dates.reverse();
            var summaries = featureSummaries();
            summaries.reverse();
            $scope.testResultStatusesOverTimeChart = {
                labels: dates,
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
                bindPieChart();
                bindLineGraph();
            }
            $scope.applyQuery();
        }

        $http.get(testResultsPath).then(response => {
            var testResultLinksJSON = response.data;
            var testResultRequests = testResultLinksJSON.map((testResultLinkJSON, i) => {
                var url = testResultsPath + testResultLinkJSON.href;
                return $http.get(url).then(testResultResponse => {
                    var testResult = TestResult.fromJSON(
                        testResultResponse.data,
                        testResultLinkJSON.name,
                        url,
                        testResultLinkJSON.modifiedTime
                    );
                    $scope.testResults[i]=testResult;
                });
            });
            $q.all(testResultRequests).then(() => {
                originalTestResults = $scope.testResults;
                $scope.testResultsLoaded = true;
                bindQueryBar();
            });
        });
    }
);
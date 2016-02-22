angular.module('testPortalControllers').controller('TestResultController', function (
    $scope, $http, $location, $anchorScroll, TestResult, $routeParams, statusesModel, pieChart) {

    var testResultPath = '/test-results/'+$routeParams.testResultId;
    var initialTag = $routeParams.tagQuery;

    $scope.query = {
        automationRadio: 'automatedAndManual',
        showCasesWithMissingJIRAOnly: false,
        tagQuery: initialTag,
    }
    $scope.statuses = statusesModel.allStatuses;

    $scope.testResultLoaded=false;
    $scope.prefixForStatus = (status) => $scope.statuses.filter(s=>s.name==status)[0].prefix;
    $scope.focusOn = (elementId) => $anchorScroll(elementId);
    $scope.statusDisplayName = statusesModel.statusDisplayName.bind(statusesModel);

    $scope.saveTestResultAndClose = function() {
        $scope.saveTestResult();
        $location.path('test-results-explorer');
    }
    $scope.saveTestResult = function() {
        var modelJSON = $scope.unfilteredTestResult.toJSON();
        $http.put(testResultPath, modelJSON).then(
            response=>alert('saved'),
            response=>alert('error saving to "'+testResultPath+'" - http status code: '+response.status)
        );
    }

    $http.get(testResultPath)
        .then(response => {
            $scope.unfilteredTestResult = TestResult.fromJSON(response.data, $routeParams.testResultId, testResultPath);
            function applyQuery() {
                var query = {
                    hasOneOfTheseTags: $scope.query.tagQuery == null ? [] : $scope.query.tagQuery.split(/[ ]+/),
                    includeTheseStatuses: $scope.statuses.filter(s=>s.selected).map(s=>s.name),
                    automationType: $scope.query.automationRadio,
                    showCasesWithMissingJIRAOnly: $scope.query.showCasesWithMissingJIRAOnly
                }
                $scope.testResult = $scope.unfilteredTestResult.filter(query);

                $scope.featurePieChart = pieChart.forSummary($scope.testResult.featuresSummary());
                $scope.scenarioPieChart = pieChart.forSummary($scope.testResult.scenariosSummary());
                $scope.stepPieChart = pieChart.forSummary($scope.testResult.stepsSummary());
            }
            applyQuery();
            $scope.applyQuery = applyQuery;
            $scope.testResultLoaded=true;
        }
    );
});
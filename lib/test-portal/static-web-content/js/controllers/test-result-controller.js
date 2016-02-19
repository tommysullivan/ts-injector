angular.module('testPortalControllers').controller('TestResultController', function (
    $scope, $http, $location, $anchorScroll, testResultModel, $routeParams) {

    var testResultPath = '/test-results/'+$routeParams.testResultId;

    $scope.testResultLoaded=false;
    $scope.automationRadio = 'automatedAndManual';
    $scope.showCasesWithMissingJIRAOnly = false;
    $scope.prefixForStatus = (status) => $scope.statuses.filter(s=>s.name==status)[0].prefix;
    $scope.focusOn = (elementId) => $anchorScroll(elementId);
    $scope.statuses = [
        { name: 'failed', selected: true, prefix: '✘'},
        { name: 'passed', selected: true, prefix: '✓' },
        { name: 'pending', selected: true, prefix: '- [pending]' },
        { name: 'notExecuted', selected: true, displayValue: 'not executed', prefix: '- [not executed]' }
    ];

    $scope.statusDisplayName = (statusName) => {
        var matchingStatus = $scope.statuses.filter(s=>s.name==statusName)[0];
        return matchingStatus.displayValue || matchingStatus.name;
    }

    $scope.testResultId = $routeParams.testResultId;

    $scope.saveTestResult = function() {
        var modelJSON = $scope.unfilteredTestResultModel.toJSON();
        $http.put(testResultPath, modelJSON).then(
            response=>alert('saved'),
            response=>alert('error saving to "'+testResultPath+'" - http status code: '+response.status)
        );
    }

    $http.get(testResultPath)
        .then(response => {
            $scope.testResult = $scope.unfilteredTestResultModel = testResultModel.fromJSON(response.data);
            function applyQuery() {
                $scope.testResult = $scope.unfilteredTestResultModel.filter({
                    hasOneOfTheseTags: $scope.tagQuery == null ? [] : $scope.tagQuery.split(/[ ]+/),
                    includeTheseStatuses: $scope.statuses.filter(s=>s.selected).map(s=>s.name),
                    automationType: $scope.automationRadio,
                    showCasesWithMissingJIRAOnly: $scope.showCasesWithMissingJIRAOnly
                });
            }
            applyQuery();
            $scope.queryChange = applyQuery;
            $scope.testResultLoaded=true;
        }
    );
});
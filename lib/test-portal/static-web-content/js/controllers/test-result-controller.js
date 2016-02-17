angular.module('testPortalControllers').controller('TestResultController', function (
    $scope, $http, $location, $anchorScroll, testResultModel) {

    $scope.testResultLoaded=false;

    $scope.focusOn = function(elementId) {
        $anchorScroll(elementId);
        //$location.hash(elementId);
    }

    $scope.prefixForStatus = (status) => {
        return {
            passed: '✓',
            failed: '✘',
            pending: '- [pending]'
        }[status] || '- [not executed]';
    }

    $scope.statuses = [
        { name: 'failed', selected: true },
        { name: 'passed', selected: true },
        { name: 'pending', selected: true },
        { name: 'notExecuted', selected: true, displayValue: 'not executed' }
    ];

    $scope.automationRadio = 'automatedAndManual';

    $scope.showCasesWithMissingJIRAOnly = false;

    $scope.statusDisplayName = (statusName) => {
        var matchingStatus = $scope.statuses.filter(s=>s.name==statusName)[0];
        return matchingStatus.displayValue || matchingStatus.name;
    }

    $http.get('latest-result.json')
        .then(response => {
            $scope.testResultLoaded=true;
            $scope.testResult = $scope.originalTestResultModel = testResultModel.fromJSON(response.data);
            function applyQuery() {
                $scope.testResult = $scope.originalTestResultModel.filter({
                    hasOneOfTheseTags: $scope.tagQuery == null ? [] : $scope.tagQuery.split(/[ ]+/),
                    includeTheseStatuses: $scope.statuses.filter(s=>s.selected).map(s=>s.name),
                    automationType: $scope.automationRadio,
                    showCasesWithMissingJIRAOnly: $scope.showCasesWithMissingJIRAOnly
                });
            }
            applyQuery();
            $scope.queryChange = applyQuery;
        }
    );
});
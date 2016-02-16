angular.module('testPortalControllers').controller('TestResultController', function (
    $scope, $http, $location, $anchorScroll, testResultModel) {

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

    //TODO: Reuse these in the summarymodel
    $scope.statuses = [
        { name: 'failed', selected: true },
        { name: 'passed', selected: true },
        { name: 'pending', selected: true }
    ];

    $http.get('latest-result.json')
        .then(response => {
            $scope.originalTestResultModel = testResultModel.fromJSON(response.data);
            function applyQuery() {
                $scope.testResult = $scope.originalTestResultModel.filter({
                    hasOneOfTheseTags: $scope.tagQuery == null ? [] : $scope.tagQuery.split(/[ ]+/),
                    includeTheseStatuses: $scope.statuses.filter(s=>s.selected).map(s=>s.name)
                });
            }
            applyQuery();
            $scope.queryChange = applyQuery;
        }
    );
});
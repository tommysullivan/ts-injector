angular.module('testPortalControllers').controller('TestResultController', function (
    $scope, $http, $location, $anchorScroll) {

    $scope.focusOn = function(elementId) {
        $anchorScroll(elementId);
        $location.hash(elementId);
    }

    $scope.prefixForStatus = (status) => {
        return {
            passed: '✓',
            failed: '✘',
            pending: '- [pending]'
        }[status] || '- [not executed]';
    }

    $http.get('latest-result.json')
        .then(response => {
            $scope.testResult = getTestResultModel(response.data);
            $scope.tagQueryChange = function() {
                //TODO: update scope.testResult with newly filtered data
            }
        }
    );
});
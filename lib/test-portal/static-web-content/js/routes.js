angular.module('testPortalApp').config(['$routeProvider', $routeProvider => {
    $routeProvider
        .when('/test-result-viewer/:testResultId', {
            templateUrl: 'views/test-result-viewer.html',
            controller: 'TestResultController'
        })
        .when('/test-runner', {
            templateUrl: 'views/test-runner.html',
            controller: 'TestRunnerController'
        })
        .when('/test-results-explorer', {
            templateUrl: 'views/test-results-explorer.html',
            controller: 'TestResultsExplorerController'
        })
        .otherwise({
            redirectTo: '/test-results-explorer'
        });
}]);
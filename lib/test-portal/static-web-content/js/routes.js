angular.module('testPortalApp').config(['$routeProvider', $routeProvider => {
    $routeProvider
        .when('/test-result-viewer/:testResultId', {
            templateUrl: 'views/test-result-viewer.html',
            controller: 'TestResultController'
        })
        .when('/test-runner', {
            templateUrl: 'views/test-runner.html',
            controller: 'TestRunner'
        })
        .when('/test-results-explorer', {
            templateUrl: 'views/test-results-explorer.html',
            controller: 'TestResultsExplorer'
        })
        .otherwise({
            redirectTo: '/test-results-explorer'
            //redirectTo: '/test-result-viewer/latest-result'
        });
}]);
angular.module('testPortalApp').config(['$routeProvider', $routeProvider => {
    $routeProvider
        .when('/test-result-viewer/:testResultId', {
            templateUrl: 'views/test-result-viewer.html',
            controller: 'TestResultController'
        })
        .when('/test-runner', {
            templateUrl: 'views/test-runner.html',
        })
        .when('/test-results-explorer', {
            templateUrl: 'views/test-results-explorer.html',
        })
        .otherwise({
            redirectTo: '/test-results-explorer'
        });
}]);
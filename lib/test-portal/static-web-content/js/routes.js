angular.module('testPortalApp').config(['$routeProvider', $routeProvider => {
    $routeProvider
        .when('/test-result-viewer/:testResultId', {
            templateUrl: 'views/test-result-viewer.html'
        })
        .when('/test-result-viewer/:testResultId/tagQuery/:tagQuery', {
            templateUrl: 'views/test-result-viewer.html'
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
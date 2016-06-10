angular.module('testPortalApp').config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/test-result-viewer/:testResultId', {
            templateUrl: 'views/test-result-viewer.html'
        })
        .when('/test-result-viewer/:testResultId/tagQuery/:tagQuery', {
            templateUrl: 'views/test-result-viewer.html'
        })
        .when('/test-runner', {
            templateUrl: 'views/test-runner.html'
        })
        .when('/test-results-explorer', {
            templateUrl: 'views/test-results-explorer.html'
        })
        .when('/server-management', {
            templateUrl: 'views/server-management.html'
        })
        .when('/dashboard', {
            templateUrl: 'views/dashboard.html'
        })
        .otherwise({
            redirectTo: '/test-results-explorer'
        });
}]);

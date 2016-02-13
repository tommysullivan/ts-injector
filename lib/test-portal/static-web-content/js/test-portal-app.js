var testPortalApp = angular.module('testPortalApp', [
    'ngRoute',
    'testPortalControllers'
]);

testPortalApp.config(['$routeProvider', $routeProvider => {
    $routeProvider
        .when('/test-results/:testResultId', {
            templateUrl: 'partials/test-result.html',
            controller: 'TestResultController'
        })
        .when('/test-runner', {
            templateUrl: 'partials/test-runner.html',
            controller: 'TestRunner'
        })
        .otherwise({
            redirectTo: '/test-results/latest-result'
        });
}]);

testPortalApp.directive('summary', function() {
    return {
        //restrict: 'E',
        scope: {
            summary: '=source'
        },
        templateUrl: 'partials/summary.html'
    };
});
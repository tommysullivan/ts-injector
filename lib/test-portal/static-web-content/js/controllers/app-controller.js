angular.module('testPortalControllers').controller('AppController', function ($scope, $location) {
    $scope.changeView = (viewName) => {
        $location.path(viewName);
    }
});
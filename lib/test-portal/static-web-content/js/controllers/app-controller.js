angular.module('testPortalApp').controller('AppController', function ($scope, $location) {
    $scope.changeView = (viewName) => {
        $location.path(viewName);
    }
});
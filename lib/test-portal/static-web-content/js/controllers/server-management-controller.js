angular.module('testPortalApp').controller('ServerManagementController', function ($scope, $http) {

    $scope.isReverting = false;

    $scope.revertCluster = function(clusterId) {
        if (confirm('Are you sure you want to revert this cluster?')) {
            $scope.isReverting = true;
            $http.post('/cluster-revert-requests', {clusterid:clusterId}).then(response=>{
                return alert('Reverted ! Wait for few minutes for services to come up');
            });
            $scope.isReverting= false;
        }
    }

    $http.get('/clusters').then(response => {
        $scope.clustersJSON = response.data;
    });
});
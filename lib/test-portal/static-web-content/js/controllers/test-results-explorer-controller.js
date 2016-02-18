angular.module('testPortalControllers').controller('TestResultsExplorerController', function (
    $scope, $http, $q, $location, $anchorScroll, testResultModel) {
        var testResultPath = 'test-results/';

        $http.get(testResultPath).then(response => {
            $scope.testResultDescriptors = response.data;
            var urls = $scope.testResultDescriptors.map(t=>testResultPath+t.href);
            urls.forEach((url, index)=>{
                $http.get(url).then(
                    response => {
                        var testResult = testResultModel.fromJSON(response.data);
                        $scope.testResultDescriptors[index].testResult = testResult;
                    },
                    error => alert('url='+url+' error='+error)
                );
            });
        });
    }
);
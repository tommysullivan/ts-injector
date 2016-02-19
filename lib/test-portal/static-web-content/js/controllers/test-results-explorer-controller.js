angular.module('testPortalControllers').controller('TestResultsExplorerController', function (
    $scope, $http, $q, $location, $anchorScroll, testResultModel, statusesModel) {
        var testResultPath = 'test-results/';

        $http.get(testResultPath).then(response => {
            $scope.testResultDescriptors = response.data;
            $q.all(
                $scope.testResultDescriptors.map(testResultDescriptor=>{
                    var url = testResultPath + testResultDescriptor.href;
                    return $http.get(url).then(
                        response => {
                            var testResult = testResultModel.fromJSON(response.data);
                            testResultDescriptor.testResult = testResult;
                        },
                        () => console.log('error loading test result, url='+url+' error='+error)
                    );
                })
            ).then(
                () => {
                    var dates = $scope.testResultDescriptors.map(t=>{
                        var d = new Date(t.modifiedTime);
                        return (    d.getMonth() + 1) + '/' + d.getDate() + '/' +  d.getFullYear() + ' - ' + d.getHours() + ':' +  d.getMinutes();
                    });
                    $scope.testResultStatusesOverTimeChart = {
                        labels: dates,
                        series: statusesModel.map(s=>s.name),
                        colours: statusesModel.map(s=>s.color),
                        data: statusesModel.map(s=>{
                            return $scope.testResultDescriptors.map(
                                t=>t.testResult.featuresSummary()[s.name]
                            );
                        })
                    }
                }
            );
        });
    }
);
angular.module('testPortalControllers').controller('TestResultController', function (
    $scope, $http, $location, $anchorScroll, TestResult, $routeParams, statusesModel, pieChart) {

    var testResultPath = '/test-results/'+$routeParams.testResultId;
    var fullPageURL = $location.protocol()+'://'+$location.host()+':'+$location.port()+'/#/test-result-viewer/'+$routeParams.testResultId;
    var jiraSyncPath = '/jira-sync-requests/';
    var initialTag = $routeParams.tagQuery;

    $scope.query = {
        automationRadio: 'automatedAndManual',
        showCasesWithMissingJIRAOnly: false,
        tagQuery: initialTag,
    }
    $scope.statuses = statusesModel.allStatuses;

    $scope.testResultLoaded=false;
    $scope.prefixForStatus = (status) => $scope.statuses.filter(s=>s.name==status)[0].prefix;
    $scope.focusOn = (elementId) => $anchorScroll(elementId);
    $scope.statusDisplayName = statusesModel.statusDisplayName.bind(statusesModel);

    $scope.saveTestResultAndClose = function() {
        $scope.saveTestResult();
        $location.path('test-results-explorer');
    }

    $scope.saveTestResult = function() {
        var modelJSON = $scope.unfilteredTestResult.toJSON();
        $http.put(testResultPath, modelJSON).then(
            response=>alert('saved'),
            response=>alert('error saving to "'+testResultPath+'" - http status code: '+response.status)
        );
    }

    $scope.syncResultsToJIRA = function() {
        var uniqueJIRATags = $scope.testResult.uniqueTags().filter(t=>t.isJIRA);
        var jiraSyncPayload = uniqueJIRATags.map(tag=>{
            var query = getQueryModel();
            query.hasOneOfTheseTags = [tag.name];
            var testResultForSpecificTag = $scope.testResult.filter(query);
            return {
                jiraKey: tag.name.substring(1),
                status: testResultForSpecificTag.status(),
                testResultURL: fullPageURL+'/tagQuery/'+tag.name,
                summaries: [
                    testResultForSpecificTag.featuresSummary(),
                    testResultForSpecificTag.scenariosSummary(),
                    testResultForSpecificTag.stepsSummary()
                ]
            }
        });
        console.log(jiraSyncPayload);
        $http.post(jiraSyncPath,JSON.stringify(jiraSyncPayload)).then(()=>alert("JIRA Sync Complete"), ()=>alert("Error syncing with JIRA"));
        console.log('posted');
    }

    function soughtTagNames() {
        return $scope.query.tagQuery == null ? [] : $scope.query.tagQuery.split(/[ ]+/)
    }

    function getQueryModel() {
        return {
            hasOneOfTheseTags: soughtTagNames(),
            includeTheseStatuses: $scope.statuses.filter(s=>s.selected).map(s=>s.name),
            automationType: $scope.query.automationRadio,
            showCasesWithMissingJIRAOnly: $scope.query.showCasesWithMissingJIRAOnly
        }
    }

    $http.get(testResultPath)
        .then(response => {
            $scope.unfilteredTestResult = TestResult.fromJSON(response.data, $routeParams.testResultId, testResultPath);
            function applyQuery() {
                var query = getQueryModel();
                $scope.testResult = $scope.unfilteredTestResult.filter(query);
                var tagNamesInResult = $scope.testResult.uniqueTags().map(t=>t.name);
                var soughtTagsWithNoMatch = soughtTagNames().filter(t=>t.charAt(0)!='~').filter(t=>!tagNamesInResult.includes(t));
                $scope.numSoughtTagsWithNoMatch = soughtTagsWithNoMatch.length;
                $scope.soughtTagsWithNoMatch = soughtTagsWithNoMatch.join(', ');
                $scope.featurePieChart = pieChart.forSummary($scope.testResult.featuresSummary());
                $scope.scenarioPieChart = pieChart.forSummary($scope.testResult.scenariosSummary());
                $scope.stepPieChart = pieChart.forSummary($scope.testResult.stepsSummary());
            }
            applyQuery();
            $scope.applyQuery = applyQuery;
            $scope.testResultLoaded=true;
        }
    );
});
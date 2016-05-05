angular.module('testPortalApp').controller('TestResultController', function (
    $scope, $http, $location, $anchorScroll, TestResult, $routeParams, statusesModel, pieChart, tag) {

    var testResultPath = '/test-results/'+$routeParams.testResultId;
    var testConfigPath = '/test-configs/'+$routeParams.testResultId;
    var fullPageURL = $location.protocol()+'://'+$location.host()+':'+$location.port()+'/#/test-result-viewer/'+$routeParams.testResultId;
    var jiraSyncPath = '/jira-sync-requests/';
    var initialTag = $routeParams.tagQuery;
    var testCLIInvocationPath = '/test-cli-invocations/'+$routeParams.testResultId;

    $scope.query = {
        automationRadio: 'automatedAndManual',
        showCasesWithMissingJIRAOnly: false,
        tagQuery: initialTag,
    }
    $scope.statuses = statusesModel.allStatuses;
    $scope.tagsFromJQLQuery = [];
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

    $scope.testConfig = {
        href: testConfigPath,
        displayName: 'Test Configuration'
    }

    $scope.testCLIInvocation = {
        href: testCLIInvocationPath,
        displayName: 'CLI Invocation Details'
    }

    $scope.applyJQLQuery = function() {
        if($scope.query.jqlQuery==null || $scope.query.jqlQuery.trim()=='') {
            $scope.tagsFromJQLQuery = [];
            applyQuery();
        }
        else {
            var jqlJSON = {
                'jqlQuery': $scope.query.jqlQuery
            }
            $http.post('/jqlQueries/', JSON.stringify(jqlJSON)).then(
                response=>{
                    $scope.tagsFromJQLQuery = response.data.issueKeysForJQL.map(k=>'@'+k);
                    applyQuery();
                },
                error=>alert('error with jql query')
            )
        }

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
    }

    function soughtTagNames() {
        return _.uniq($scope.query.tagQuery == null || $scope.query.tagQuery.trim()==''
                ? []
                : $scope.query.tagQuery.split(/[ ]+/)
            ).concat($scope.tagsFromJQLQuery);
    }

    function getQueryModel() {
        return {
            hasOneOfTheseTags: soughtTagNames(),
            includeTheseStatuses: $scope.statuses.filter(s=>s.selected).map(s=>s.name),
            automationType: $scope.query.automationRadio,
            showCasesWithMissingJIRAOnly: $scope.query.showCasesWithMissingJIRAOnly
        }
    }

    function applyQuery() {
        var query = getQueryModel();
        $scope.testResult = $scope.unfilteredTestResult.filter(query);
        var totalSoughtTags = query.hasOneOfTheseTags.length;
        var tagNamesInResult = $scope.testResult.uniqueTags().map(t=>t.name);
        var soughtTagsWithNoMatch = soughtTagNames()
            .filter(t=>t.charAt(0)!='~')
            .filter(t=>!tagNamesInResult.includes(t))
            .map(tag.fromName);
        
        $scope.flattenedClusterConfig = $scope.testResult.flattenedClusterConfig();
        $scope.versionGraph = $scope.testResult.versionGraph();
        $scope.configJSON = $scope.testResult.configJSON();
        $scope.foundSoughtTags = totalSoughtTags - soughtTagsWithNoMatch.length;
        $scope.totalSoughtTags = totalSoughtTags;
        $scope.numSoughtTagsWithNoMatch = soughtTagsWithNoMatch.length;
        $scope.soughtTagsWithNoMatch = soughtTagsWithNoMatch;
        $scope.featurePieChart = pieChart.forSummary($scope.testResult.featuresSummary());
        $scope.scenarioPieChart = pieChart.forSummary($scope.testResult.scenariosSummary());
        $scope.stepPieChart = pieChart.forSummary($scope.testResult.stepsSummary());
    }

    $http.get(testResultPath, {headers: {Accept:'application/json'}})
        .then(response => {
            $scope.unfilteredTestResult = TestResult.fromJSON(response.data, $routeParams.testResultId, testResultPath);
            applyQuery();
            $scope.applyQuery = applyQuery;
            $scope.testResultLoaded=true;
        }
    );
});
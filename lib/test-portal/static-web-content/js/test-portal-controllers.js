var testPortalControllers = angular.module('testPortalControllers', []);
var summaryOutputStatuses = ['passed','failed','skipped','pending','total'];

function statusSummary(statuses, type) {
    var summary = {}
    summaryOutputStatuses.forEach(os => summary[os] = statuses.filter(s=>s==os).length);
    summary.total = statuses.length;
    summary.type = type;
    return summary;
}

function aggregateSummary(summaries, type) {
    var result = {}
    summaryOutputStatuses.forEach(os => result[os] = summaries.reduce((i, summary)=>summary[os] + i, 0));
    result.type = type;
    return result;
}

var stepStatuses = (steps) => steps.filter(s=>!s.hidden).map(s=>s.result).filter(r=>r).map(r=>r.status);

function aggregateStatus(summary) {
    return summary.passed == summary.total && summary.total > 0
        ? 'passed' : summary.failed > 0 ? 'failed' : summary.skipped > 0 ? 'skipped' : 'pending';
}

testPortalControllers.controller('TestRunner', function() {

});

testPortalControllers.controller('TestResultController', function ($scope, $http, $location, $anchorScroll, $timeout) {
    $scope.focusOn = elementId => {
        $location.hash(elementId);
        $anchorScroll();
        $location.hash(elementId);
    }
    $scope.prefixForStatus = (status) => {
        var s = status;
        return s=='passed' ? '✓' : s == 'failed' ? '✘' : s == 'pending' ? '- [pending]' : '- [not executed]';
    }
    $http.get('latest-result.json')
        .then(response => {
                var features = response.data;
                features.forEach(feature => {
                    var scenarios = (feature.elements || []).filter(s=>s.keyword != 'Background');
                    scenarios.forEach(scenario => {
                        scenario.summary = statusSummary(stepStatuses(scenario.steps || []), 'steps');
                        scenario.status = aggregateStatus(scenario.summary);
                    });
                    feature.elements = scenarios;
                    feature.scenariosSummary = statusSummary(scenarios.map(s=>s.status), 'scenarios');
                    feature.stepsSummary = aggregateSummary(scenarios.map(s=>s.summary), 'steps');
                    feature.status = aggregateStatus(feature.scenariosSummary);
                });
                var featuresSummary = statusSummary(features.map(f=>f.status), 'features');
                $scope.report = {
                    features: features,
                    featuresSummary: featuresSummary,
                    scenariosSummary: aggregateSummary(features.map(f=>f.scenariosSummary), 'scenarios'),
                    stepsSummary: aggregateSummary(features.map(f=>f.stepsSummary), 'steps'),
                    status: aggregateStatus(featuresSummary)
                };
            }
        );
});
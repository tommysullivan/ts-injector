var testPortalApp = angular.module('testPortalApp', []);

var summaryOutputStatuses = ['passed','failed','skipped','pending','total'];

function statusSummary(statuses) {
    var summary = {}
    summaryOutputStatuses.forEach(os => summary[os] = statuses.filter(s=>s==os).length);
    summary.total = statuses.length;
    return summary;
}

function aggregateSummary(summaries) {
    var result = {}
    summaryOutputStatuses.forEach(os => result[os] = summaries.reduce((i, summary)=>summary[os] + i, 0));
    return result;
}

var stepStatuses = (steps) => steps.filter(s=>!s.hidden).map(s=>s.result).filter(r=>r).map(r=>r.status);

function aggregateStatus(summary) {
    return summary.passed == summary.total && summary.total > 0
        ? 'passed' : summary.failed > 0 ? 'failed' : summary.skipped > 0 ? 'skipped' : 'pending';
}

testPortalApp.controller('featuresController', function ($scope, $http) {
    $http.get('latest-result.json')
        .then(response => {
            var features = response.data;
             features.forEach(feature => {
                var scenarios = (feature.elements || []).filter(s=>s.keyword != 'Background');
                scenarios.forEach(scenario => {
                    scenario.summary = statusSummary(stepStatuses(scenario.steps || []));
                    scenario.status = aggregateStatus(scenario.summary);
                });
                feature.elements = scenarios;
                feature.scenariosSummary = statusSummary(scenarios.map(s=>s.status));
                feature.stepsSummary = aggregateSummary(scenarios.map(s=>s.summary));
                feature.status = aggregateStatus(feature.scenariosSummary);
            });
            var featuresSummary = statusSummary(features.map(f=>f.status));
            $scope.report = {
                features: features,
                featuresSummary: featuresSummary,
                scenariosSummary: aggregateSummary(features.map(f=>f.scenariosSummary)),
                stepsSummary: aggregateSummary(features.map(f=>f.stepsSummary)),
                status: aggregateStatus(featuresSummary)
            };
        }
    );
});
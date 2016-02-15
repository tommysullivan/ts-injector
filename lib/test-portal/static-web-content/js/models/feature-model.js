function getFeatureModel(featureJSON) {
    var scenarios = (featureJSON.elements || []).filter(s=>s.keyword != 'Background').map(getScenarioModel);
    var scenariosSummary =  statusSummary(scenarios.map(s=>s.status), 'scenarios');
    return {
        name: featureJSON.name,
        id: featureJSON.id,
        scenarios: scenarios,
        scenariosSummary: scenariosSummary,
        stepsSummary: aggregateSummary(scenarios.map(s=>s.summary), 'steps'),
        status: aggregateStatus(scenariosSummary)
    }
}
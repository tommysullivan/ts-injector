var stepStatuses = (steps) => steps.map(s=>s.result).filter(r=>r).map(r=>r.status);

function getScenarioModel(scenarioJSON) {
    var steps = (scenarioJSON.steps || []).filter(s=>!s.hidden).map(getStepModel);
    var summary = statusSummary(stepStatuses(steps), 'steps');
    return {
        name: scenarioJSON.name,
        keyword: scenarioJSON.keyword,
        steps: steps,
        summary: summary,
        status: aggregateStatus(summary)
    }
}
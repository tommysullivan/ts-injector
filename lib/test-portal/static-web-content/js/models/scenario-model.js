angular.module('testPortalApp').factory('scenarioModel', (stepModel, summaryModel) => {
    function ScenarioModel(scenarioJSON, steps) {
        var summary = summaryModel.statusSummary(steps.map(s=>s.status), 'steps');
        return {
            name: scenarioJSON.name,
            tags: scenarioJSON.tags,
            tagNames: (scenarioJSON.tags || []).map(tag => tag.name),
            keyword: scenarioJSON.keyword,
            steps: steps,
            summary: summary,
            status: summaryModel.aggregateStatus(summary),
            matchesTags: function(soughtTags) {
                var noneMatch = (soughtTag) => {
                    return this.tagNames.filter(
                            tagName => tagName.includes(soughtTag.substring(1))
                        ).length == 0;
                }
                var someMatch = (soughtTag) => {
                    return this.tagNames.filter(
                            tagName => tagName.includes(soughtTag)
                        ).length > 0;
                }
                var tagCriteriaMatchResults = soughtTags.map(
                    soughtTag => {
                        return soughtTag.charAt(0)=='~'
                            ? soughtTag.length == 1
                            ? true
                            : noneMatch(soughtTag)
                            : someMatch(soughtTag);
                    }
                );
                return tagCriteriaMatchResults.filter(matched=>matched).length > 0;
            }
        }
    }
    return {
        fromJSON: (scenarioJSON) => {
            var steps = (scenarioJSON.steps || []).filter(s=>!s.hidden).map(stepJSON => stepModel.fromJSON(stepJSON));
            var scenario = ScenarioModel(scenarioJSON, steps);
            var isManual = scenario.matchesTags(['@Manual']);
            if(isManual) {
                steps.forEach(step=>{ step.status='notExecuted'; step.isManual=true; });
                scenario = ScenarioModel(scenarioJSON, steps);
            }
            return scenario;
        }
    }
});
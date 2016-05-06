angular.module('testPortalApp').factory('scenarioModel', function(stepModel, summaryModel, tag) {
    //(stepModel, summaryModel, tag) => {
    function ScenarioModel(scenarioJSON, steps) {
        var tagModels = (scenarioJSON.tags || []).map(tagJSON => tag.fromJSON(tagJSON));
        var scenario =  {
            id: scenarioJSON.id,
            name: scenarioJSON.name,
            tags: tagModels,
            tagNames: (scenarioJSON.tags || []).map(tag => tag.name),
            keyword: scenarioJSON.keyword,
            steps: steps,
            summary: () => summaryModel.statusSummary(steps.map(s=>s.status), 'steps'),
            status: function() { return summaryModel.aggregateStatus(scenario.summary()) },
            matchesTags: function(soughtTags) {
                var numMatching = (soughtTag) => {
                    return scenario.tagNames.filter(
                            tagName => tagName.includes(soughtTag)
                        ).length;
                }
                var tagCriteriaMatchResults = soughtTags.map(
                    soughtTag => {
                        return soughtTag.charAt(0)=='~'
                            ? soughtTag.length == 1
                                ? true
                                : numMatching(soughtTag.substring(1)) == 0
                            : numMatching(soughtTag) > 0;
                    }
                );
                return tagCriteriaMatchResults.filter(matched=>matched).length > 0;
            },
            isManual: function() { return this.matchesTags(['@Manual']); },
            toJSON: function() {
                return {
                    id: this.id,
                    name: this.name,
                    tags: this.tags,
                    tagNames: this.tagNames,
                    keyword: this.keyword,
                    steps: this.steps.map(s=>s.toJSON()),
                    hasBeenLoadedAlready: true
                }
            }
        }
        return scenario;
    }
    return {
        fromJSON: (scenarioJSON, contentType) => {
            var steps = (scenarioJSON.steps || []).filter(s=>!s.hidden).map(stepJSON => stepModel.fromJSON(stepJSON, this));
            var scenario = ScenarioModel(scenarioJSON, steps);
            var isManual = scenario.isManual();
            if(isManual) {
                steps.forEach(step=>{
                    if(!scenarioJSON.hasBeenLoadedAlready) step.status = 'notExecuted';
                    step.isManual = true;
                });
                scenario = ScenarioModel(scenarioJSON, steps);
            }
            return scenario;
        }
    }
});
angular.module('testPortalApp').factory('scenarioModel', (stepModel, summaryModel) => {
    function ScenarioModel(scenarioJSON, steps) {
        scenarioJSON.tags.forEach(t=>{
            if(t.name.indexOf('SPYG-')>=0) t.href=`https://maprdrill.atlassian.net/browse/${t.name.substring(1)}`;
        });
        var scenario =  {
            id: scenarioJSON.id,
            name: scenarioJSON.name,
            tags: scenarioJSON.tags,
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
            toJSON: function() {
                return {
                    id: this.id,
                    name: this.name,
                    tags: this.tags,
                    tagNames: this.tagNames,
                    keyword: this.keyword,
                    steps: this.steps.map(s=>s.toJSON())
                }
            }
        }
        return scenario;
    }
    return {
        fromJSON: (scenarioJSON, contentType) => {
            var steps = (scenarioJSON.steps || []).filter(s=>!s.hidden).map(stepJSON => stepModel.fromJSON(stepJSON));
            var scenario = ScenarioModel(scenarioJSON, steps);
            var isManual = scenario.matchesTags(['@Manual']);
            if(isManual) {
                steps.forEach(step=>{
                    if(contentType=='application/json') step.status='notExecuted';
                    step.isManual=true;
                });
                scenario = ScenarioModel(scenarioJSON, steps);
            }
            return scenario;
        }
    }
});
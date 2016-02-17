angular.module('testPortalApp').factory('featureModel', (scenarioModel, summaryModel) => {
    function FeatureModel(featureJSON, scenarioModels) {
        var scenariosSummary =  summaryModel.statusSummary(scenarioModels.map(s=>s.status), 'scenarios');
        return {
            name: featureJSON.name,
            id: featureJSON.id,
            scenarios: scenarioModels,
            scenariosSummary: scenariosSummary,
            stepsSummary: summaryModel.aggregateSummary(scenarioModels.map(s=>s.summary), 'steps'),
            status: summaryModel.aggregateStatus(scenariosSummary),
            filter: function(query) {


                //what problem do i want to solve?
                //for one, the summary is not considering changes to the steps
                //for two, the dropdown is reverting to another state
                //this indicates that something about the filter process is replacing the stepModels
                //with stepModels in state "notExecuted". Why that is not also changing the css for the step
                //i don't know at this time.

                //first thing to do is to see how filter relates to the step models that were updated.
                //(NOTE: JSON is not updated which is just fine)

                //without recreation, it does not resummarize based on current state.
                //which explains

                //TODO: Implement AND / OR of tags
                //TODO: Use lazy compositions of filter predicates if it improves performance
                //TODO: Separate summation from construction

                var filteredScenarios = query.hasOneOfTheseTags == null || query.hasOneOfTheseTags.length == 0
                    ? scenarioModels
                    : scenarioModels.filter(s => s.matchesTags(query.hasOneOfTheseTags));

                filteredScenarios = filteredScenarios.filter(
                    scenario => query.includeTheseStatuses.indexOf(scenario.status) >= 0
                );

                var automationTags = query.automationType == 'manualOnly' ? ['@Manual'] : ['~@Manual'];
                filteredScenarios = query.automationType == 'automatedAndManual'
                    ? filteredScenarios
                    : filteredScenarios.filter(s => s.matchesTags(automationTags));

                filteredScenarios = query.showCasesWithMissingJIRAOnly
                    ? filteredScenarios.filter(scenario => scenario.matchesTags(['~@SPYG-']))
                    : filteredScenarios

                return FeatureModel(featureJSON, filteredScenarios);
            }
        }
    }
    return {
        fromJSON: (featureJSON) => {
            var scenarioModels = (featureJSON.elements || []).filter(s=>s.keyword != 'Background').map(scenarioModel.fromJSON);
            return FeatureModel(featureJSON, scenarioModels);
        }
    }
});
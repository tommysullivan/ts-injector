angular.module('testPortalApp').factory('featureModel', (scenarioModel, summaryModel) => {
    function FeatureModel(featureJSON, scenarioModels) {
        return {
            name: featureJSON.name,
            id: featureJSON.id,
            scenarios: scenarioModels,
            scenariosSummary: () => summaryModel.statusSummary(scenarioModels.map(s=>s.status()), 'scenarios'),
            stepsSummary: () => summaryModel.aggregateSummary(scenarioModels.map(s=>s.summary()), 'steps'),
            status: function() { return summaryModel.aggregateStatus(this.scenariosSummary()) },
            uniqueTags: function() {
                return _.chain(this.scenarios).map(s=>s.tags).flatten().uniq(false, t=>t.name).value();
            },
            filter: function(query) {
                var filteredScenarios = query.hasOneOfTheseTags == null || query.hasOneOfTheseTags.length == 0
                    ? scenarioModels
                    : scenarioModels.filter(s => s.matchesTags(query.hasOneOfTheseTags));

                filteredScenarios = filteredScenarios.filter(
                    scenario => query.includeTheseStatuses.indexOf(scenario.status()) >= 0
                );

                var automationTags = query.automationType == 'manualOnly' ? ['@Manual'] : ['~@Manual'];
                filteredScenarios = query.automationType == 'automatedAndManual'
                    ? filteredScenarios
                    : filteredScenarios.filter(s => s.matchesTags(automationTags));

                filteredScenarios = query.showCasesWithMissingJIRAOnly
                    ? filteredScenarios.filter(scenario => scenario.matchesTags(['~@SPYG-']))
                    : filteredScenarios

                return FeatureModel(featureJSON, filteredScenarios);
            },
            toJSON: function() {
                return {
                    name: this.name,
                    id: this.id,
                    scenarios: this.scenarios.map(s=>s.toJSON())
                }
            }
        }
    }
    return {
        fromJSON: (featureJSON, contentType) => {
            var scenarioJSONs = contentType=='application/json' ? featureJSON.elements : featureJSON.scenarios;
            var scenarioModels = (scenarioJSONs || []).filter(s=>s.keyword != 'Background').map(s=>scenarioModel.fromJSON(s, contentType));
            return FeatureModel(featureJSON, scenarioModels);
        }
    }
});
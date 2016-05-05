angular.module('testPortalApp').factory('featureModel', function(summaryModel, scenarioModel) {
    function FeatureModel(featureJSON, scenarioModels, contentType) {
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

                console.log('query.showCasesWithMissingJIRAOnly', query.showCasesWithMissingJIRAOnly);
                filteredScenarios = query.showCasesWithMissingJIRAOnly
                    ? filteredScenarios.filter(scenario => scenario.matchesTags(['~@SPYG-']))
                    : filteredScenarios

                return FeatureModel(featureJSON, filteredScenarios, contentType);
            },
            toJSON: function() {
                var json = {
                    name: this.name,
                    id: this.id,
                    scenarios: this.scenarios.map(s=>s.toJSON())
                }
                if(contentType=='vnd/mapr.test-portal.cluster-test-result+json;v=1.0.0') json.elements = this.scenarios.map(s=>s.toJSON());
                else if(contentType=='vnd/mapr.test-portal.cluster-test-result+json;v=2.0.0') json.elements = this.scenarios.map(s=>s.toJSON());
                else json.scenarios = this.scenarios.map(s=>s.toJSON());
                return json;
            }
        }
    }
    return {
        fromJSON: (featureJSON, contentType) => {
            var scenarioJSONs = contentType=='vnd/mapr.test-portal.test-result+json' 
                ? featureJSON.scenarios 
                : featureJSON.elements;
            var scenarioModels = (scenarioJSONs || []).filter(s=>s.keyword != 'Background').map(s=>scenarioModel.fromJSON(s, contentType));
            return FeatureModel(featureJSON, scenarioModels, contentType);
        }
    }
});
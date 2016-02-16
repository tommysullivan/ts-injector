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
                var scenariosMatchingTagQuery = query.hasOneOfTheseTags == null || query.hasOneOfTheseTags.length == 0
                    ? scenarioModels
                    : scenarioModels.filter(
                        scenario => scenario.tagNames.filter(
                            tagName=>query.hasOneOfTheseTags.filter(
                                soughtTag => tagName.includes(soughtTag)
                            ).length > 0
                        ).length > 0
                    );

                var scenariosMatchingTagAndStatusQuery = scenariosMatchingTagQuery.filter(
                    scenario => query.includeTheseStatuses.indexOf(scenario.status) >= 0
                );

                return FeatureModel(featureJSON, scenariosMatchingTagAndStatusQuery);
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
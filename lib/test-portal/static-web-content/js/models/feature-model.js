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
                //TODO: Move logic to scenario model
                function bySoughtTags(soughtTags) {
                    return scenario => {
                        function noneMatch(soughtTag) {
                            return scenario.tagNames.filter(
                                    tagName => tagName.includes(soughtTag.substring(1))
                                ).length == 0;
                        }
                        function someMatch(soughtTag) {
                            return scenario.tagNames.filter(
                                    tagName => tagName.includes(soughtTag)
                                ).length > 0;
                        }
                        var tagCriteriaMetAssessments = soughtTags.map(
                            soughtTag => {
                                return soughtTag.charAt(0)=='~'
                                    ? soughtTag.length == 1
                                        ? true
                                        : noneMatch(soughtTag)
                                    : someMatch(soughtTag);
                            }
                        );
                        var metOneCriteriaOrAnother = tagCriteriaMetAssessments.filter(met=>met==true).length > 0;
                        console.log(scenario.name + ' ' + tagCriteriaMetAssessments + ' - ' + metOneCriteriaOrAnother);
                        return metOneCriteriaOrAnother;
                    }
                }

                var scenariosMatchingTagQuery = query.hasOneOfTheseTags == null || query.hasOneOfTheseTags.length == 0
                    ? scenarioModels
                    : scenarioModels.filter(bySoughtTags(query.hasOneOfTheseTags));

                var scenariosMatchingTagAndStatusQuery = scenariosMatchingTagQuery.filter(
                    scenario => query.includeTheseStatuses.indexOf(scenario.status) >= 0
                );

                var automationFilter = query.automationType == 'automatedAndManual'
                    ? scenario => scenario
                    : query.automationType == 'manualOnly'
                        ? bySoughtTags(['@Manual'])
                        : bySoughtTags(['~@Manual']);

                var scenariosWithCorrectAutomationType = scenariosMatchingTagAndStatusQuery.filter(automationFilter);

                return FeatureModel(featureJSON, scenariosWithCorrectAutomationType);
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
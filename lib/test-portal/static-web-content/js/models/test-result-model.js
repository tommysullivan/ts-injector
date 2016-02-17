angular.module('testPortalApp').factory('testResultModel', (summaryModel, featureModel) => {
    function TestResult(featureModels) {
        return {
            features: featureModels,
            featuresSummary: () => summaryModel.statusSummary(featureModels.map(f=>f.status()), 'features'),
            scenariosSummary: () => summaryModel.aggregateSummary(featureModels.map(f=>f.scenariosSummary()), 'scenarios'),
            stepsSummary: () => summaryModel.aggregateSummary(featureModels.map(f=>f.stepsSummary()), 'steps'),
            status: function() { return summaryModel.aggregateStatus(this.featuresSummary()) },
            filter: function(query) {
                var filteredFeatures = featureModels
                    .map(feature => feature.filter(query))
                    .filter(feature => feature.scenarios.length > 0);
                return TestResult(filteredFeatures);
            }
        }
    }
    return {
        fromJSON: (featuresJSONArray) => {
            var featureModels = featuresJSONArray.map(featureModel.fromJSON);
            return TestResult(featureModels);
        }
    }
});
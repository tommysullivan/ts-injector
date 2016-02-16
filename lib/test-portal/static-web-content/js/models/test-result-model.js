angular.module('testPortalApp').factory('testResultModel', (summaryModel, featureModel) => {
    function TestResult(featureModels) {
        var featuresSummary = summaryModel.statusSummary(featureModels.map(f=>f.status), 'features');
        return {
            features: featureModels,
            featuresSummary: featuresSummary,
            scenariosSummary: summaryModel.aggregateSummary(featureModels.map(f=>f.scenariosSummary), 'scenarios'),
            stepsSummary: summaryModel.aggregateSummary(featureModels.map(f=>f.stepsSummary), 'steps'),
            status: summaryModel.aggregateStatus(featuresSummary),
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
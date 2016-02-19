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
            },
            toJSON: function() {
                return {
                    contentType: 'vnd/mapr.test-portal.test-result+json',
                    version: '0.1.0',
                    features: this.features.map(f=>f.toJSON())
                }
            }
        }
    }
    return {
        fromJSON: (testResultJSON) => {
            var contentType = testResultJSON.contentType || 'application/json';
            var featuresJSONArray = contentType == 'application/json' ? testResultJSON : testResultJSON.features;
            var featureModels = featuresJSONArray.map(f=>featureModel.fromJSON(f, contentType));
            return TestResult(featureModels);
        }
    }
});
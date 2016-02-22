angular.module('testPortalApp').factory('TestResult', (summaryModel, featureModel) => {
    function TestResult(featureModels, name, href, modifiedTime) {
        return {
            name: name,
            href: href,
            modifiedTime: modifiedTime,
            features: featureModels,
            featuresSummary: () => summaryModel.statusSummary(featureModels.map(f=>f.status()), 'features'),
            scenariosSummary: () => summaryModel.aggregateSummary(featureModels.map(f=>f.scenariosSummary()), 'scenarios'),
            stepsSummary: () => summaryModel.aggregateSummary(featureModels.map(f=>f.stepsSummary()), 'steps'),
            status: function() {
                var fs = this.featuresSummary();
                var status = summaryModel.aggregateStatus(fs);
                return status;
            },
            filter: function(query) {
                var filteredFeatures = featureModels
                    .map(feature => feature.filter(query))
                    .filter(feature => feature.scenarios.length > 0);
                return TestResult(filteredFeatures, name, href, modifiedTime);
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
        fromJSON: (testResultJSON, name, href, modifiedTime) => {
            var contentType = testResultJSON.contentType || 'application/json';
            var featuresJSONArray = contentType == 'application/json' ? testResultJSON : testResultJSON.features;
            var featureModels = featuresJSONArray.map(f=>featureModel.fromJSON(f, contentType));
            return TestResult(featureModels, name, href, modifiedTime);
        }
    }
});
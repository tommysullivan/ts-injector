angular.module('testPortalApp').factory('TestResult', (summaryModel, featureModel) => {
    function TestResult(featureModels, name, href, modifiedTime, contentType, testResultJSON) {
        return {
            name: name,
            href: href,
            modifiedTime: modifiedTime,
            features: featureModels,
            clusterId: () => testResultJSON.cucumberRunConfig.clusterId,
            controllerHost: () => testResultJSON.cucumberRunConfig.flattenedClusterConfig.controller.host,
            nodeNames: () => testResultJSON.cucumberRunConfig.flattenedClusterConfig.nodes.map(n=>n.host),
            testResultJSON: () => {
                return {
                    flattenedClusterConfig: (testResultJSON.cucumberRunConfig || {}).flattenedClusterConfig,
                    versionGraph: testResultJSON.versionGraph,
                    configJSON: (testResultJSON.cucumberRunConfig || {}).configJSON
                }
            },
            contentType: () => contentType,
            featuresSummary: () => summaryModel.statusSummary(featureModels.map(f=>f.status()), 'features'),
            scenariosSummary: () => summaryModel.aggregateSummary(featureModels.map(f=>f.scenariosSummary()), 'scenarios'),
            stepsSummary: () => summaryModel.aggregateSummary(featureModels.map(f=>f.stepsSummary()), 'steps'),
            status: function() {
                var fs = this.featuresSummary();
                var status = summaryModel.aggregateStatus(fs);
                return status;
            },
            uniqueTags: function() {
                return _.chain(this.features).map(f=>f.uniqueTags()).flatten().uniq(false, t=>t.name).value();
            },
            filter: function(query) {
                var filteredFeatures = featureModels
                    .map(feature => feature.filter(query))
                    .filter(feature => feature.scenarios.length > 0);
                return TestResult(filteredFeatures, name, href, modifiedTime, contentType, testResultJSON);
            },
            toJSON: function() {
                switch(contentType) {
                    case 'vnd/mapr.test-portal.cluster-test-result+json;v=1.0.0':
                        var copyOfJSON = JSON.parse(JSON.stringify(testResultJSON));
                        copyOfJSON.resultJSON = this.features.map(f=>f.toJSON());
                        return copyOfJSON;
                    default:
                        return {
                            contentType: 'vnd/mapr.test-portal.test-result+json',
                            version: '0.1.0',
                            features: this.features.map(f=>f.toJSON())
                        }
                }
            }
        }
    }
    return {
        fromJSON: (testResultJSON, name, href, modifiedTime) => {
            var contentType = testResultJSON.contentType || 'application/json';
            var featuresJSONArray = [];
            switch(contentType) {
                case 'vnd/mapr.test-portal.cluster-test-result+json;v=1.0.0':
                    featuresJSONArray = testResultJSON.resultJSON;
                    break;
                case 'vnd/mapr.test-portal.test-result+json':
                    featuresJSONArray = testResultJSON.features;
                    break;
                case 'application/json':
                    featuresJSONArray = testResultJSON;
                    break;
            }
            var featureModels = featuresJSONArray.map(f=>featureModel.fromJSON(f, contentType));
            return TestResult(featureModels, name, href, modifiedTime, contentType, testResultJSON);
        }
    }
});
function getTestResultModel(featuresJSONArray) {
    var features = featuresJSONArray.map(getFeatureModel);
    var featuresSummary = statusSummary(features.map(f=>f.status), 'features');
    return {
        features: features,
        featuresSummary: featuresSummary,
        scenariosSummary: aggregateSummary(features.map(f=>f.scenariosSummary), 'scenarios'),
        stepsSummary: aggregateSummary(features.map(f=>f.stepsSummary), 'steps'),
        status: aggregateStatus(featuresSummary)
    }
}
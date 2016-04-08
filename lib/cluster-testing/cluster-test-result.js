"use strict";
var ClusterTestResult = (function () {
    function ClusterTestResult(cucumberRunConfig, cucumberTestResult, frameworkConfiguration, versionGraph, versionGraphError, clusterConfiguration) {
        this.cucumberRunConfig = cucumberRunConfig;
        this.cucumberTestResult = cucumberTestResult;
        this.frameworkConfiguration = frameworkConfiguration;
        this.versionGraph = versionGraph;
        this.versionGraphError = versionGraphError;
        this.clusterConfiguration = clusterConfiguration;
    }
    ClusterTestResult.prototype.toJSON = function () {
        return {
            contentType: 'vnd/mapr.test-portal.cluster-test-result+json;v=2.0.0',
            cucumberTestResult: this.cucumberTestResult.toJSON(),
            versionGraph: this.versionGraph ? this.versionGraph.toJSON() : null,
            versionGraphError: this.versionGraphError,
            clusterConfiguration: this.clusterConfiguration.toJSON(),
            frameworkConfiguration: this.frameworkConfiguration.toJSON(),
            passed: this.passed()
        };
    };
    ClusterTestResult.prototype.toString = function () {
        return JSON.stringify(this.toJSON(), null, 3);
    };
    ClusterTestResult.prototype.passed = function () { return !this.cucumberTestResult.processResult.hasError(); };
    return ClusterTestResult;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterTestResult;
//# sourceMappingURL=cluster-test-result.js.map
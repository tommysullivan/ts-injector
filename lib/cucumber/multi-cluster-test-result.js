module.exports = function(testRunGUID, clusterTestResults, _) {
    return {
        clusterTestResults: () => clusterTestResults,
        toString: function() {
            return JSON.stringify(this.toJSON(), null, 3);
        },
        toJSON: function() {
            return {
                type: 'cucumber/multi-cluster-test-result',
                testRunGUID: testRunGUID,
                clusterTestResults: clusterTestResults.map(c=>c.toJSON()),
                passed: this.passed()
            }
        },
        passed: () => _.all(clusterTestResults, r=>r.passed()),
        toPrettyString: function() {
            return `Multi Cluster Test Result - ${this.passed()?'passed':'failed'}\n\n${clusterTestResults.map(c=>c.toPrettyString()).join("\n")}`;
        }
    }
}
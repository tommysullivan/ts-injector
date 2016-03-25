module.exports = function() {
    this.When(/^I request the cluster version graph$/, function (callback) {
        this.clusterUnderTest.versionGraph()
            .then(versionGraph=>this.versionGraph=versionGraph)
            .done(()=>callback(), error=>callback(error.toString()));
    });

    this.Then(/^it returns a valid JSON file$/, function () {
        JSON.parse(this.versionGraph);
    });
}
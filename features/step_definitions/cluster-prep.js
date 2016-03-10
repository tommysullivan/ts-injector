module.exports = function() {

    this.Given(/^I have automatically prepared a single node cluster as described by "([^"]*)"$/, function (featureFilePath, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I prepare it using automation described by "([^"]*)"$/, function (featureFilePath, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^the Cluster Under Test is managed by ESXI$/, function () {
        if(!this.clusterUnderTest.isManagedByESXI()) throw new Error("Cluster not managed by esxi");
    });

    this.When(/^I revert the cluster to its configured "([^"]*)" state$/, function (desiredStateName) {
        return this.clusterUnderTest.revertToState(desiredStateName);
    });

    this.Then(/^the cluster does not have MapR Installed$/, function () {
        return this.clusterUnderTest.verifyMapRNotInstalled();
    });

}
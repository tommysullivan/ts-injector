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

    this.When(/^I revert the cluster to its configured "([^"]*)" state/, function (desiredStateName, callback) {
        this.clusterUnderTest.revertToState(desiredStateName).done(
            success=>callback(),
            error=>callback(error.toString())
        );
    });

    this.Then(/^the cluster does not have MapR Installed$/, function (callback) {
        this.clusterUnderTest.verifyMapRNotInstalled().done(
            success=>callback(),
            error=>callback(error.toString())
        );
    });

    this.Given(/^the Operating Systems of each node match what is configured to be expected$/, function () {
        //TODO: Implement
    });

    this.Given(/^I delete "([^"]*)" snapshots for each node in the cluster$/, function (stateName, callback) {
        this.clusterUnderTest.deleteStateIfExists(stateName).done(
            success => callback(),
            callback
        );
    });

    this.Given(/^each node is in its configured "([^"]*)" state$/, function (expectedNodeState, callback) {
        //determine expected snapshotIds for each node based on configured "expectedNodeState"
        //for each node, check the current snapshot using ssh tooling
        callback.pending();
    });

    this.Given(/^I take "([^"]*)" snapshots of each node in the cluster$/, function (snapshotName, callback) {
        this.clusterUnderTest.captureStateAsSnapshot(snapshotName).done(
            success => { console.log('snapshot output', success); callback(); },
            error => callback(error.toString())
        );
    });

    this.When(/^I request the latest snapshot info from the cluster$/, function (callback) {
        this.clusterUnderTest.snapshotInfo().done(
            success => { console.log('snapshot output', success); callback(); },
            error => callback(error.toString())
        );
    });

    this.Then(/^it prints in the test ouptut$/, function () {
    });


    this.When(/^I manually retrieve the ids of these new snapshots based on the console output of the previous step retrieve the ids of these new snapshots$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Then(/^I manually update the configured "([^"]*)" state for the cluster with the snapshot ids$/, function (arg1, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

}
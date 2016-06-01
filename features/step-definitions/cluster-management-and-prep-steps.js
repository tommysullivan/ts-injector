"use strict";
module.exports = function () {
    this.Given(/^the Cluster Under Test is managed by ESXI$/, function () {
        return $.expect($.clusterUnderTest.isManagedByESXI()).to.be.true;
    });
    this.Given(/^the Operating Systems of each node match what is configured$/, function () {
        //TODO: Implement
    });
    this.Given(/^I power off each node in the cluster$/, function () {
        return $.expect($.clusterUnderTest.powerOff()).to.eventually.be.fulfilled;
    });
    this.Then(/^I retrieve the snapshot ids and output them to the stdout$/, function () {
        var snapshotInfoRequest = $.clusterUnderTest.snapshotInfo()
            .then(function (snapshotInfo) { return $.console.log(snapshotInfo.toJSONString()); });
        return $.expect(snapshotInfoRequest).to.eventually.be.fulfilled;
    });
    function ensureFailureOutputWorksWithChaiAsPromised(e) {
        throw new Error(e.toString());
    }
    this.When(/^I revert the cluster to its configured "([^"]*)" state$/, function (desiredStateName) {
        var revertRequest = $.clusterUnderTest.revertToState(desiredStateName)
            .catch(ensureFailureOutputWorksWithChaiAsPromised);
        return $.expect(revertRequest).to.eventually.be.fulfilled;
    });
    this.Then(/^the cluster does not have MapR Installed$/, function () {
        return $.expect($.clusterUnderTest.verifyMapRNotInstalled()).to.eventually.be.fulfilled;
    });
    this.When(/^I request the cluster version graph$/, function () {
        var _this = this;
        return $.clusterUnderTest.versionGraph()
            .then(function (v) { return _this.versionGraph = v; });
    });
    this.Then(/^it returns a valid JSON file$/, function () {
        var versionGraph = this.versionGraph;
        return $.expect(versionGraph.toJSONString()).not.to.throw;
    });
    this.When(/^I delete "([^"]*)" snapshots for each node in the cluster$/, function (stateName) {
        return $.expect($.clusterUnderTest.deleteSnapshotsWithStateName(stateName)).to.eventually.be.fulfilled;
    });
    this.When(/^I request the latest snapshot info from the cluster$/, function () {
        return $.expect($.clusterUnderTest.snapshotInfo()).to.eventually.be.fulfilled;
    });
    this.When(/^I take "([^"]*)" snapshots of each node in the cluster$/, function (snapshotName) {
        return $.expect($.clusterUnderTest.captureSnapshotNamed(snapshotName)).to.eventually.be.fulfilled;
    });
    this.When(/^I retrieve the latest snapshot info for the cluster and output it to stdout$/, function () {
        var snapshotInfoRequest = $.clusterUnderTest.snapshotInfo().then(function (i) { return console.log(i.toJSONString()); });
        return $.expect(snapshotInfoRequest).to.eventually.be.fulfilled;
    });
    this.Then(/^I manually update the configured "([^"]*)" state for the cluster with the snapshot ids$/, function (arg1) { });
    this.Given(/^I have installed Spyglass$/, function () { });
};
//# sourceMappingURL=cluster-management-and-prep-steps.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var ClusterPreparationSteps = (function () {
    function ClusterPreparationSteps() {
    }
    ClusterPreparationSteps.prototype.ensureFailureOutputWorksWithChaiAsPromised = function (e) {
        throw new Error(e.toString());
    };
    ClusterPreparationSteps.prototype.retrieveSnapshotIdsAndOutputToConsole = function () {
        var snapshotInfoRequest = $.clusterUnderTest.snapshotInfo()
            .then(function (snapshotInfo) { return $.console.log(snapshotInfo.toJSONString()); });
        return $.expect(snapshotInfoRequest).to.eventually.be.fulfilled;
    };
    ClusterPreparationSteps.prototype.revertClusterToState = function (desiredStateName) {
        var _this = this;
        var revertRequest = $.clusterUnderTest.revertToState(desiredStateName)
            .catch(function (e) { return _this.ensureFailureOutputWorksWithChaiAsPromised(e); });
        return $.expect(revertRequest).to.eventually.be.fulfilled;
    };
    ClusterPreparationSteps.prototype.deleteSnapshotsForEachNode = function (stateNameToDelete) {
        return $.expect($.clusterUnderTest.deleteSnapshotsWithStateName(stateNameToDelete)).to.eventually.be.fulfilled;
    };
    ClusterPreparationSteps.prototype.requestLatestSnapshotInfo = function () {
        return $.expect($.clusterUnderTest.snapshotInfo()).to.eventually.be.fulfilled;
    };
    ClusterPreparationSteps.prototype.takeSnapshotsOfEachClusterNode = function (snapshotName) {
        return $.expect($.clusterUnderTest.captureSnapshotNamed(snapshotName)).to.eventually.be.fulfilled;
    };
    ClusterPreparationSteps.prototype.retrieveLatestSnapshotInfoAndOutputToStdOut = function () {
        var snapshotInfoRequest = $.clusterUnderTest.snapshotInfo().then(function (i) { return console.log(i.toJSONString()); });
        return $.expect(snapshotInfoRequest).to.eventually.be.fulfilled;
    };
    ClusterPreparationSteps.prototype.manuallyUpdateConfiguredState = function (stateName) { };
    __decorate([
        cucumber_tsflow_1.then(/^I retrieve the snapshot ids and output them to the stdout$/)
    ], ClusterPreparationSteps.prototype, "retrieveSnapshotIdsAndOutputToConsole", null);
    __decorate([
        cucumber_tsflow_1.when(/^I revert the cluster to its configured "([^"]*)" state$/)
    ], ClusterPreparationSteps.prototype, "revertClusterToState", null);
    __decorate([
        cucumber_tsflow_1.when(/^I delete "([^"]*)" snapshots for each node in the cluster$/)
    ], ClusterPreparationSteps.prototype, "deleteSnapshotsForEachNode", null);
    __decorate([
        cucumber_tsflow_1.when(/^I request the latest snapshot info from the cluster$/)
    ], ClusterPreparationSteps.prototype, "requestLatestSnapshotInfo", null);
    __decorate([
        cucumber_tsflow_1.when(/^I take "([^"]*)" snapshots of each node in the cluster$/)
    ], ClusterPreparationSteps.prototype, "takeSnapshotsOfEachClusterNode", null);
    __decorate([
        cucumber_tsflow_1.when(/^I retrieve the latest snapshot info for the cluster and output it to stdout$/)
    ], ClusterPreparationSteps.prototype, "retrieveLatestSnapshotInfoAndOutputToStdOut", null);
    __decorate([
        cucumber_tsflow_1.then(/^I manually update the configured "([^"]*)" state for the cluster with the snapshot ids$/)
    ], ClusterPreparationSteps.prototype, "manuallyUpdateConfiguredState", null);
    ClusterPreparationSteps = __decorate([
        cucumber_tsflow_1.binding()
    ], ClusterPreparationSteps);
    return ClusterPreparationSteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterPreparationSteps;
module.exports = ClusterPreparationSteps;
//# sourceMappingURL=cluster-preparation-steps.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var ClusterManagementSteps = (function () {
    function ClusterManagementSteps() {
    }
    ClusterManagementSteps.prototype.verifyClusterUnderTestIsESXI = function () {
        $.expect($.clusterUnderTest.isManagedByESXI()).to.be.true;
    };
    ClusterManagementSteps.prototype.verifyOperatingSystemOnEachNodeMathcesWhatIsConfigured = function () {
        $.console.log('WARN: step "the Operating Systems of each node match what is configured" currently does nothing');
    };
    ClusterManagementSteps.prototype.powerOffEachNode = function () {
        return $.expect($.clusterUnderTest.powerOff()).to.eventually.be.fulfilled;
    };
    ClusterManagementSteps.prototype.getClusterName = function () {
        var _this = this;
        var futureClusterName = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(function (sshSession) { return sshSession.executeCommand('/opt/mapr/bin/maprcli dashboard info -json'); })
            .then(function (commandResult) {
            var jsonString = commandResult.processResult().stdoutLines().join("");
            var json = JSON.parse(jsonString);
            var clusterName = json.data[0].cluster.name;
            console.log(clusterName);
            _this.clusterName = clusterName;
            return clusterName;
        });
        return $.expect(futureClusterName).to.eventually.exist;
    };
    ClusterManagementSteps.prototype.verifyClusterDoesNotHaveMapRInstalled = function () {
        return $.expect($.clusterUnderTest.verifyMapRNotInstalled()).to.eventually.be.fulfilled;
    };
    ClusterManagementSteps.prototype.getClusterVersionGraph = function () {
        var _this = this;
        var futureVersionGraph = $.clusterUnderTest.versionGraph()
            .then(function (v) { return _this.versionGraph = v; });
        return $.expect(futureVersionGraph).to.eventually.exist;
    };
    ClusterManagementSteps.prototype.verifyVersionGraphIsValidJSON = function () {
        var versionGraph = this.versionGraph;
        $.expect(function () { return versionGraph.toJSONString(); }).not.to.throw;
    };
    ClusterManagementSteps.prototype.verifySpyglassIsInstalled = function () {
        $.console.log('WARN: step "I have installed Spyglass" currently does nothing');
    };
    ClusterManagementSteps.prototype.verifyMaprInstalled = function () {
        return $.expectAll($.clusterUnderTest.nodes().map(function (n) { return n.verifyMapRIsInstalled(); })).to.eventually.be.fulfilled;
    };
    ClusterManagementSteps.prototype.verifyNodeRunningSpecifiedServiceIsRunning = function (serviceName) {
        var isHostingHbaseMasterServers = $.clusterUnderTest.nodesHosting(serviceName).isEmpty;
        $.expect(isHostingHbaseMasterServers).to.be.false;
    };
    ClusterManagementSteps.prototype.stopServiceOnAllNodesThatHostIt = function (command, serviceName) {
        return $.expectAll($.clusterUnderTest.nodesHosting(serviceName).map(function (n) {
            return n.executeShellCommand("service " + serviceName + " " + command);
        })).to.eventually.be.fulfilled;
    };
    __decorate([
        cucumber_tsflow_1.given(/^the Cluster Under Test is managed by ESXI$/)
    ], ClusterManagementSteps.prototype, "verifyClusterUnderTestIsESXI", null);
    __decorate([
        cucumber_tsflow_1.given(/^the Operating Systems of each node match what is configured$/)
    ], ClusterManagementSteps.prototype, "verifyOperatingSystemOnEachNodeMathcesWhatIsConfigured", null);
    __decorate([
        cucumber_tsflow_1.given(/^I power off each node in the cluster$/)
    ], ClusterManagementSteps.prototype, "powerOffEachNode", null);
    __decorate([
        cucumber_tsflow_1.then(/^I get the clusterName$/)
    ], ClusterManagementSteps.prototype, "getClusterName", null);
    __decorate([
        cucumber_tsflow_1.then(/^the cluster does not have MapR Installed$/)
    ], ClusterManagementSteps.prototype, "verifyClusterDoesNotHaveMapRInstalled", null);
    __decorate([
        cucumber_tsflow_1.when(/^I request the cluster version graph$/)
    ], ClusterManagementSteps.prototype, "getClusterVersionGraph", null);
    __decorate([
        cucumber_tsflow_1.then(/^it returns a valid JSON file$/)
    ], ClusterManagementSteps.prototype, "verifyVersionGraphIsValidJSON", null);
    __decorate([
        cucumber_tsflow_1.given(/^I have installed Spyglass$/)
    ], ClusterManagementSteps.prototype, "verifySpyglassIsInstalled", null);
    __decorate([
        cucumber_tsflow_1.given(/^the cluster has MapR Installed$/)
    ], ClusterManagementSteps.prototype, "verifyMaprInstalled", null);
    __decorate([
        cucumber_tsflow_1.given(/^I have a node running the "([^"]*)" service$/)
    ], ClusterManagementSteps.prototype, "verifyNodeRunningSpecifiedServiceIsRunning", null);
    __decorate([
        cucumber_tsflow_1.when(/^I ([^"]*) all "([^"]*)" services$/)
    ], ClusterManagementSteps.prototype, "stopServiceOnAllNodesThatHostIt", null);
    ClusterManagementSteps = __decorate([
        cucumber_tsflow_1.binding()
    ], ClusterManagementSteps);
    return ClusterManagementSteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterManagementSteps;
module.exports = ClusterManagementSteps;
//# sourceMappingURL=cluster-management-steps.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var MFSSteps = (function () {
    function MFSSteps() {
    }
    MFSSteps.prototype.getMapRCLIVolumeInfo = function () {
        var _this = this;
        var command = "/opt/mapr/bin/maprcli volume info -name " + this.volumeName + " -json";
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(function (sshSession) { return sshSession.executeCommand(command); })
            .then(function (commandResult) {
            var jsonString = commandResult.processResult().stdoutLines().join("");
            var json = JSON.parse(jsonString);
            var logicalUsed = json.data[0].logicalUsed;
            var totalUsed = json.data[0].totalused;
            var usedSize = json.data[0].used;
            var quota = json.data[0].quota;
            var snapshotSize = json.data[0].snapshotused;
            _this.snapshotSize = parseInt(snapshotSize);
            _this.quota = parseInt(quota);
            _this.logicalUsed = parseInt(logicalUsed);
            _this.totalUsed = parseInt(totalUsed);
            _this.usedSize = parseInt(usedSize);
        });
        return $.expect(result).to.eventually.be.fulfilled;
    };
    MFSSteps.prototype.turnOffVolumeCompression = function () {
        $.console.log('WARN: step "I turn off compression on the volume" currently does nothing');
    };
    MFSSteps.prototype.createVolumeSnapshot = function () {
        this.snapshot = this.volumeName + "_snapshot";
        var command = "/opt/mapr/bin/maprcli volume snapshot create -cluster " + this.clusterName + " -snapshotname " + this.snapshot + " -volume " + this.volumeName + " -json";
        var futureStatus = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(function (sshSession) { return sshSession.executeCommand(command); })
            .then(function (commandResult) {
            var jsonString = commandResult.processResult().stdoutLines().join("");
            var json = JSON.parse(jsonString);
            $.console.log(json.status);
            return json.status;
        });
        return $.expect(futureStatus).to.eventually.contain("OK");
    };
    MFSSteps.prototype.createVolume = function () {
        this.volumeName = this.volumeNameTemplate.replace('{testRunGUID}', $.testRunGUID);
        var command = "/opt/mapr/bin/maprcli volume create -name " + this.volumeName + " -json";
        var futureStatus = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(function (sshSession) { return sshSession.executeCommand(command); })
            .then(function (commandResult) {
            var jsonString = commandResult.processResult().stdoutLines().join("");
            var json = JSON.parse(jsonString);
            $.console.log(json.status);
            return json.status;
        });
        return $.expect(futureStatus).to.eventually.contain("OK");
    };
    MFSSteps.prototype.mountVolume = function () {
        this.mountPath = "/" + this.volumeName;
        var command = "/opt/mapr/bin/maprcli volume mount -cluster " + this.clusterName + " -name " + this.volumeName + " -path " + this.mountPath + " -json";
        var futureStatus = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(function (sshSession) { return sshSession.executeCommand(command); })
            .then(function (commandResult) {
            var jsonString = commandResult.processResult().stdoutLines().join("");
            var json = JSON.parse(jsonString);
            $.console.log(json.status);
            return json.status;
        });
        return $.expect(futureStatus).to.eventually.contain('OK');
    };
    MFSSteps.prototype.setVolumeQuota = function (quota) {
        var command = "/opt/mapr/bin/maprcli volume modify -cluster " + this.clusterName + " -name " + this.volumeName + " -quota " + quota + " -json";
        var futureStatus = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(function (sshSession) { return sshSession.executeCommand(command); })
            .then(function (commandResult) {
            var jsonString = commandResult.processResult().stdoutLines().join("");
            var json = JSON.parse(jsonString);
            $.console.log(json.status);
            return json.status;
        });
        return $.expect(futureStatus).to.eventually.contain('OK');
    };
    MFSSteps.prototype.setMFSInstance = function (mfsInstances) {
        var futureSSHResult = $.clusterUnderTest.nodes().first().executeShellCommand("maprcli config save -values '{\"multimfs.numinstances.pernode\":\"" + mfsInstances + "}'");
        return $.expect(futureSSHResult).to.eventually.be.fulfilled;
    };
    __decorate([
        cucumber_tsflow_1.when(/^I get the expected value using maprcli volume info command$/)
    ], MFSSteps.prototype, "getMapRCLIVolumeInfo", null);
    __decorate([
        cucumber_tsflow_1.when(/^I turn off compression on the volume$/)
    ], MFSSteps.prototype, "turnOffVolumeCompression", null);
    __decorate([
        cucumber_tsflow_1.when(/^I create a snapshot for the volume$/)
    ], MFSSteps.prototype, "createVolumeSnapshot", null);
    __decorate([
        cucumber_tsflow_1.when(/^A volume called "([^"]*)"is created$/)
    ], MFSSteps.prototype, "createVolume", null);
    __decorate([
        cucumber_tsflow_1.when(/^The volume is mounted$/)
    ], MFSSteps.prototype, "mountVolume", null);
    __decorate([
        cucumber_tsflow_1.when(/^I set the volume quota to "([^"]*)"$/)
    ], MFSSteps.prototype, "setVolumeQuota", null);
    __decorate([
        cucumber_tsflow_1.given(/^I set the mfs instance to "([^"]*)"$/)
    ], MFSSteps.prototype, "setMFSInstance", null);
    MFSSteps = __decorate([
        cucumber_tsflow_1.binding()
    ], MFSSteps);
    return MFSSteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MFSSteps;
module.exports = MFSSteps;
//# sourceMappingURL=mfs-steps.js.map
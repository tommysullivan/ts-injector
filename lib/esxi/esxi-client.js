"use strict";
var ESXIClient = (function () {
    function ESXIClient(sshAPI, host, username, password, collections, vmId) {
        this.sshAPI = sshAPI;
        this.host = host;
        this.username = username;
        this.password = password;
        this.collections = collections;
        this.vmId = vmId;
    }
    ESXIClient.prototype.getSSHSession = function () {
        return this.sshAPI.newSSHClient().connect(this.host, this.username, this.password);
    };
    ESXIClient.prototype.executeCommand = function (command) {
        return this.getSSHSession().then(function (sshSession) { return sshSession.executeCommand(command); });
    };
    ESXIClient.prototype.restoreSnapshot = function (snapshotID) {
        return this.executeCommand("vim-cmd vmsvc/snapshot.revert " + this.vmId + " " + snapshotID + " 0");
    };
    ESXIClient.prototype.removeSnapshot = function (snapshotID) {
        return this.executeCommand("vim-cmd vmsvc/snapshot.remove " + this.vmId + " " + snapshotID);
    };
    ESXIClient.prototype.captureStateAsSnapshot = function (snapshotName) {
        var commands = this.collections.newList([
            ("vim-cmd vmsvc/snapshot.create " + this.vmId + " " + snapshotName),
            ("vim-cmd vmsvc/get.snapshotinfo " + this.vmId)
        ]);
        return this.getSSHSession()
            .then(function (sshSession) { return sshSession.executeCommands(commands); });
    };
    ESXIClient.prototype.snapshotInfo = function () {
        var command = "vim-cmd vmsvc/get.snapshotinfo " + this.vmId;
        return this.getSSHSession()
            .then(function (sshSession) { return sshSession.executeCommand(command); });
    };
    ESXIClient.prototype.powerOn = function () {
        return this.executeCommand("vim-cmd vmsvc/power.on " + this.vmId);
    };
    ESXIClient.prototype.powerReset = function () {
        var _this = this;
        return this.getSSHSession().then(function (sshSession) { return sshSession.executeCommands(_this.collections.newList([
            ("vim-cmd vmsvc/power.off " + _this.vmId),
            ("vim-cmd vmsvc/power.on " + _this.vmId)
        ])); });
    };
    ESXIClient.prototype.powerOff = function () {
        return this.executeCommand("vim-cmd vmsvc/power.off " + this.vmId);
    };
    return ESXIClient;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ESXIClient;
//# sourceMappingURL=esxi-client.js.map
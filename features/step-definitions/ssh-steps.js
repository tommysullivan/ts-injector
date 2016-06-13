"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var SSHSteps = (function () {
    function SSHSteps() {
    }
    SSHSteps.prototype.performSSHCommandsOnEachNodeInTheCluster = function (commandsSeparatedByNewLine) {
        var commandList = $.collections.newList(commandsSeparatedByNewLine.split("\n"));
        return $.expect($.clusterUnderTest.executeShellCommandsOnEachNode(commandList))
            .to.eventually.be.fulfilled;
    };
    SSHSteps.prototype.sshIntoNodeHostingService = function (serviceName) {
        var _this = this;
        this.sshServiceHost = $.clusterUnderTest.nodeHosting(serviceName);
        var sshSessionRequest = this.sshServiceHost.newSSHSession()
            .then(function (sshSession) { return _this.sshSession = sshSession; });
        return $.expect(sshSessionRequest).to.eventually.be.fulfilled;
    };
    SSHSteps.prototype.downloadFromPackageFamilyRepoViaCurlUsingExistingSSHSession = function (fileToRetrieve, destinationDirectory, packageFamily) {
        throw new Error('not impl');
        // var commands = $.collections.newList<string>([
        //     `curl ${this.sshServiceHost.repositoryForPackageFamily(packageFamily).url}${fileToRetrieve} > ${destinationDirectory}${fileToRetrieve}`,
        //     `chmod 744 ${destinationDirectory}${fileToRetrieve}`
        // ]);
        // return $.expect(this.sshSession.executeCommands(commands)).to.eventually.be.fulfilled;
    };
    SSHSteps.prototype.executeSSHCommandInExistingSession = function (sshCommand) {
        var _this = this;
        function repoUrlFor(packageFamily) {
            return this.sshServiceHost.repositoryForPackageFamily(packageFamily).url;
        }
        sshCommand = sshCommand.replace('[installerRepoURL]', repoUrlFor('installer'));
        sshCommand = sshCommand.replace('[maprCoreRepoURL]', repoUrlFor('core'));
        sshCommand = sshCommand.replace('[ecosystemRepoURL]', repoUrlFor('ecosystem'));
        var sshRequest = this.sshSession.executeCommand(sshCommand)
            .then(function (result) { return _this.sshResult = result; })
            .catch(function (e) {
            var error = e;
            console.log(error.toJSON());
            throw new Error(error.toString());
        });
        return $.expect(sshRequest).to.eventually.be.fulfilled;
    };
    SSHSteps.prototype.runSpecifiedCommandsOnFirstNodeInCluster = function (commandsString) {
        var _this = this;
        var commands = $.collections.newList(commandsString.split("\n"));
        commands = commands.map(function (c) { return c.replace('{testRunGUID}', $.testRunGUID).replace('{volumeMountPoint}', _this.mountPath); });
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(function (sshSession) { return sshSession.executeCommands(commands); })
            .then(function (commandResultSet) { return _this.lastCommandResultSet = commandResultSet; });
        return $.expect(result).to.eventually.be.fulfilled;
    };
    SSHSteps.prototype.scpLocalPathToRemotePathOnEachNode = function (localPath, remotePath) {
        var result = $.clusterUnderTest.uploadToEachNode(localPath, remotePath);
        return $.expect(result).to.eventually.to.fulfilled;
    };
    SSHSteps.prototype.performSSHCommandsAsSpecficUserOnEachNode = function (user, userPasswd, commandsSeparatedByNewLin) {
        var commandList = $.collections.newList(commandsSeparatedByNewLin.split("\n"));
        var nodeRequests = $.clusterUnderTest.nodes().map(function (n) {
            return $.sshAPI.newSSHClient().connect(n.host, user, userPasswd)
                .then(function (session) { return session.executeCommands(commandList); });
        });
        return $.expectAll(nodeRequests).to.eventually.be.fulfilled;
    };
    __decorate([
        cucumber_tsflow_1.when(/^I perform the following ssh commands on each node in the cluster:$/)
    ], SSHSteps.prototype, "performSSHCommandsOnEachNodeInTheCluster", null);
    __decorate([
        cucumber_tsflow_1.when(/^I ssh into the node hosting "([^"]*)"$/)
    ], SSHSteps.prototype, "sshIntoNodeHostingService", null);
    __decorate([
        cucumber_tsflow_1.when(/^within my ssh session, I download "([^"]*)" to "([^"]*)" from the repository for the "([^"]*)" package family/)
    ], SSHSteps.prototype, "downloadFromPackageFamilyRepoViaCurlUsingExistingSSHSession", null);
    __decorate([
        cucumber_tsflow_1.when(/^within my ssh session, I execute "([^"]*)"$/)
    ], SSHSteps.prototype, "executeSSHCommandInExistingSession", null);
    __decorate([
        cucumber_tsflow_1.when(/^I run the following commands on any given node in the cluster:$/)
    ], SSHSteps.prototype, "runSpecifiedCommandsOnFirstNodeInCluster", null);
    __decorate([
        cucumber_tsflow_1.when(/^I scp "([^"]*)" to "([^"]*)" on each node in the cluster$/)
    ], SSHSteps.prototype, "scpLocalPathToRemotePathOnEachNode", null);
    __decorate([
        cucumber_tsflow_1.given(/^I perform the following ssh commands on each node in the cluster as user "([^"]*)" with password "([^"]*)":$/)
    ], SSHSteps.prototype, "performSSHCommandsAsSpecficUserOnEachNode", null);
    SSHSteps = __decorate([
        cucumber_tsflow_1.binding()
    ], SSHSteps);
    return SSHSteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SSHSteps;
module.exports = SSHSteps;
//# sourceMappingURL=ssh-steps.js.map
"use strict";
module.exports = function () {
    this.When(/^I perform the following ssh commands on each node in the cluster:$/, function (commands) {
        var commandList = $.collections.newList(commands.split("\n"));
        return $.expect($.clusterUnderTest.executeShellCommandsOnEachNode(commandList))
            .to.eventually.be.fulfilled;
    });
    this.When(/^I ssh into the node hosting "([^"]*)"$/, function (serviceName) {
        var _this = this;
        this.sshServiceHost = $.clusterUnderTest.nodeHosting(serviceName);
        var sshSessionRequest = this.sshServiceHost.newSSHSession()
            .then(function (sshSession) { return _this.sshSession = sshSession; });
        return $.expect(sshSessionRequest).to.eventually.be.fulfilled;
    });
    this.When(/^within my ssh session, I download "([^"]*)" to "([^"]*)" from the repository for the "([^"]*)" component family/, function (fileToRetrieve, destinationDirectory, componentFamily) {
        var sshSession = this.sshSession;
        var sshServiceHost = this.sshServiceHost;
        var commands = $.collections.newList([
            ("curl " + sshServiceHost.repoUrlFor(componentFamily) + fileToRetrieve + " > " + destinationDirectory + fileToRetrieve),
            ("chmod 744 " + destinationDirectory + fileToRetrieve)
        ]);
        var sshRequest = sshSession.executeCommands(commands)
            .catch(this.handleError);
        return $.expect(sshRequest).to.eventually.be.fulfilled;
    });
    this.When(/^within my ssh session, I execute "([^"]*)"$/, { timeout: 10 * 60 * 1000 }, function (sshCommand) {
        var _this = this;
        var sshSession = this.sshSession;
        var sshServiceHost = this.sshServiceHost;
        sshCommand = sshCommand.replace('[installerRepoURL]', sshServiceHost.repoUrlFor('mapr-installer'));
        sshCommand = sshCommand.replace('[maprCoreRepoURL]', sshServiceHost.repoUrlFor('MapR Core'));
        sshCommand = sshCommand.replace('[ecosystemRepoURL]', sshServiceHost.repoUrlFor('Ecosystem'));
        var sshRequest = sshSession.executeCommand(sshCommand)
            .then(function (result) { return _this.sshResult = result; })
            .catch(function (e) {
            console.log(e.toJSON());
            throw new Error(e.toString());
        });
        return $.expect(sshRequest).to.eventually.be.fulfilled;
    });
    this.Then(/^it successfully starts the installer web server and outputs its URL to the screen$/, function () {
        var sshResult = this.sshResult;
        var sshOutput = sshResult.processResult().stdoutLines().join('');
        $.expect(sshOutput.indexOf('To continue installing MapR software, open the following URL in a web browser')).not.to.equal(-1);
    });
    this.Given(/^the cluster is running YARN$/, function () {
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(function (sshSession) { return sshSession.executeCommand('/opt/mapr/bin/maprcli cluster mapreduce get -json'); })
            .then(function (commandResult) {
            var jsonString = commandResult.processResult().stdoutLines().join("");
            var json = JSON.parse(jsonString);
            return json.data[0].default_mode;
        });
        return $.expect(result).to.eventually.equal('yarn');
    });
    this.When(/^I run the following commands on any given node in the cluster:$/, function (commandsString) {
        var _this = this;
        var commands = $.collections.newList(commandsString.split("\n"));
        commands = commands.map(function (c) { return c.replace('{testRunGUID}', $.testRunGUID).replace('{volumeMountPoint}', _this.mountPath); });
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(function (sshSession) { return sshSession.executeCommands(commands); })
            .then(function (commandResultSet) { return _this.lastCommandResultSet = commandResultSet; });
        return $.expect(result).to.eventually.be.fulfilled;
    });
    this.Then(/^I get the clusterName$/, function () {
        var _this = this;
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(function (sshSession) { return sshSession.executeCommand('/opt/mapr/bin/maprcli dashboard info -json'); })
            .then(function (commandResult) {
            var jsonString = commandResult.processResult().stdoutLines().join("");
            var json = JSON.parse(jsonString);
            var clusterName = json.data[0].cluster.name;
            $.expect(clusterName).is.not.null;
            console.log(clusterName);
            _this.clustName = clusterName;
        });
        return $.expect(result).to.eventually.be.fulfilled;
    });
    this.Given(/^A volume called "([^"]*)"is created$/, function (volumeNameTemplate) {
        this.volumeName = volumeNameTemplate.replace('{testRunGUID}', $.testRunGUID);
        var command = "/opt/mapr/bin/maprcli volume create -name " + this.volumeName + " -json";
        console.log(command);
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(function (sshSession) { return sshSession.executeCommand(command); })
            .then(function (commandResult) {
            var jsonString = commandResult.processResult().stdoutLines().join("");
            var json = JSON.parse(jsonString);
            var status = json.status;
            console.log(status);
            $.expect(status).contain("OK");
        });
        return $.expect(result).to.eventually.be.fulfilled;
    });
    this.Given(/^The volume is mounted$/, function () {
        this.mountPath = "/" + this.volumeName;
        console.log("MountPath is " + this.mountPath);
        var command = "/opt/mapr/bin/maprcli volume mount -cluster " + this.clustName + " -name " + this.volumeName + " -path " + this.mountPath + " -json";
        console.log(command);
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(function (sshSession) { return sshSession.executeCommand(command); })
            .then(function (commandResult) {
            var jsonString = commandResult.processResult().stdoutLines().join("");
            var json = JSON.parse(jsonString);
            var status = json.status;
            console.log(status);
            $.expect(status).contain("OK");
        });
        return $.expect(result).to.eventually.be.fulfilled;
    });
    this.Then(/^I get the expected value using maprcli volume info command$/, function () {
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
            _this.logicalUsed = parseInt(logicalUsed);
            _this.totalUsed = parseInt(totalUsed);
            _this.usedSize = parseInt(usedSize);
        });
        return $.expect(result).to.eventually.be.fulfilled;
    });
};
//# sourceMappingURL=ssh-steps.js.map
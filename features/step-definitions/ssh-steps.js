"use strict";
module.exports = function () {
    this.When(/^I perform the following ssh commands on each node in the cluster:$/, { timeout: 5 * 60 * 1000 }, function (commands) {
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
        commands = commands.map(function (c) { return c.replace('{testRunGUID}', $.testRunGUID); });
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(function (sshSession) { return sshSession.executeCommands(commands); })
            .then(function (commandResultSet) { return _this.lastCommandResultSet = commandResultSet; });
        return $.expect(result).to.eventually.be.fulfilled;
    });
    this.When(/^I scp "([^"]*)" to "([^"]*)" on each node in the cluster$/, function (localPath, remotePath) {
        var result = $.clusterUnderTest.executeCopyCommandOnEachNode(localPath, remotePath);
        return $.expect(result).to.eventually.to.fulfilled;
    });
};
//# sourceMappingURL=ssh-steps.js.map
module.exports = function() {
    this.When(/^I perform the following ssh commands on each node in the cluster:$/, function (commandsString, callback) {
        var commands = commandsString.split("\n");
        this.clusterUnderTest.executeShellCommandsOnEachNode(commands).done(
            shellCommandResultSet => { this.shellCommandResultSet = shellCommandResultSet; callback()},
            shellCommandResultSet => callback(shellCommandResultSet.toString())
        )
    });
}
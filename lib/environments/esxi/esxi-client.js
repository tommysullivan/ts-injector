module.exports = function(api, host, username, password) {
    function getSSHSession() {
        return api.newSSHClient().connect(host, username, password);
    }
    function executeCommand(command) {
        return getSSHSession().then(sshSession => sshSession.executeCommand(command));
    }
    return {
        restoreSnapshot: function(vmID, snapshotID) {
            return executeCommand(`vim-cmd vmsvc/snapshot.revert ${vmID} ${snapshotID} 0`);
        },
        removeSnapshot: function(vmID, snapshotID) {
            return executeCommand(`vim-cmd vmsvc/snapshot.remove ${vmID} ${snapshotID}`);
        },
        captureStateAsSnapshot: function(vmID, snapshotName) {
            return getSSHSession().then(
                sshSession=>sshSession.executeCommands([
                    `vim-cmd vmsvc/snapshot.create ${vmID} ${snapshotName}`,
                    `vim-cmd vmsvc/get.snapshotinfo ${vmID}`
                ]).then(shellCommandResultSet=>{
                    return shellCommandResultSet.resultNumber(2).stdoutLines();
                })
            );
        },
        snapshotInfo: function(vmID) {
            return getSSHSession().then(
                sshSession=>sshSession.executeCommand(
                    `vim-cmd vmsvc/get.snapshotinfo ${vmID}`
                ).then(shellCommandResult => shellCommandResult.stdoutLines())
            );
        },
        powerOn: function(vmID) {
            return executeCommand(`vim-cmd vmsvc/power.on ${vmID}`);
        }
    }
}
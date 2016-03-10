module.exports = function(api, host, username, password) {
    return {
        restoreSnapshot: function(vmID, snapshotID) {
            return this.runCommands([
                `vim-cmd vmsvc/snapshot.revert ${vmID} ${snapshotID} 0`,
                `vim-cmd vmsvc/power.on ${vmID}`
            ]);
        },
        runCommands: function(commands) {
            return api.newPromise((resolve, reject) => {
                api.newSSHClient().connect(host, username, password).done(
                    sshSession => {
                        sshSession.executeCommands(commands).done(
                            output=> {
                                sshSession.close();
                                resolve(output);
                            },
                            error => {
                                sshSession.close();
                                reject(error);
                            }
                        );
                    },
                    reject
                );
            });
        }
    }
}
module.exports = function(api, esxiClient, nodeConfiguration, _, sshClient, repositories) {
    function getShellSession() {
        return sshClient.connect(nodeConfiguration.host, nodeConfiguration.username, nodeConfiguration.password);
    }
    function stateConfigWithName(stateName) {
        return _.findWhere(nodeConfiguration.states, {name: stateName});
    }
    return {
        revertToState: stateName => {
            return api.newPromise((resolve, reject) => {
                var state = stateConfigWithName(stateName);
                if(state==null) reject(new Error(`Invalid state requested for node ${nodeConfiguration.name}. Requested State Name: ${stateName}`));
                else if(state.snapshotId==null) reject(new Error(`Requested state for node ${nodeConfiguration.name} had no snapshotID. Requested State Name: ${stateName}`));
                esxiClient.restoreSnapshot(nodeConfiguration.esxiId, state.snapshotId)
                    .then(() => esxiClient.powerOn(nodeConfiguration.esxiId))
                    .done(resolve, reject);
            });
        },
        deleteStateIfExists: (stateName) => {
            return api.newPromise((resolve, reject) => {
                var state = stateConfigWithName(stateName);
                if(state == null || state.snapshotId == null) resolve(`not deleting, state ${stateName} is not defined in configuration for host ${this.host()}`);
                else {
                    //TODO: Implement a check that the snapshot actually exists before attempting delete
                    esxiClient.removeSnapshot(nodeConfiguration.esxiId, state.snapshotId)
                        .done(resolve, reject);
                }
            });
        },
        captureStateAsSnapshot: function(snapshotName) {
            return esxiClient.captureStateAsSnapshot(nodeConfiguration.esxiId, snapshotName);
        },
        snapshotInfo: function() {
            return esxiClient.snapshotInfo(nodeConfiguration.esxiId);
        },
        executeShellCommands: function(commands) {
            var commandsWithResolvedPlaceholders = commands.map(c=>c.replace('{{packageCommand}}', this.packageCommand()));
            return getShellSession().then(sshSession => {
                return sshSession.executeCommands(commandsWithResolvedPlaceholders);
            });
        },
        verifyMapRNotInstalled: () => {
            return api.newPromise((resolve, reject) => {
                getShellSession()
                    .then(sshSession => sshSession.executeCommand('ls /opt/mapr'))
                    .then(shellCommandResult=>reject(`/opt/mapr directory exists on host ${nodeConfiguration.host}`))
                    .catch(shellCommandResult => {
                        (shellCommandResult.processExitCode()==2
                            ? resolve()
                            : reject(
                                  `Could not determine if /opt/mapr exists on host ${nodeConfiguration.host}.`
                                + `Result: ${shellCommandResult.toString()}`
                            )
                        )
                    });
            });
        },
        isHostingService: serviceName => {
            return _.contains(nodeConfiguration.serviceNames, serviceName);
        },
        host: () => nodeConfiguration.host,
        username: () => nodeConfiguration.username,
        password: () => nodeConfiguration.password,
        operatingSystem: () => nodeConfiguration.operatingSystem,
        packageCommand: function() { return repositories.packageCommandFor(this.operatingSystem()); },
        repositoryURLFor: function(componentName) { return repositories.repositoryURLFor(this.operatingSystem(), componentName); },
        urlFor: function(componentName) {
            var url = {
                'mapr-elasticsearch': `http://${this.host()}:9200`,
                'GUI Installer': `https://${this.host()}:9443`
            }[componentName];
            if(url==null) throw new Error(`url not found for component: ${componentName}`);
            return url;
        }
    }
}
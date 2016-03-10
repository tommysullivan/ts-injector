module.exports = function(api, esxiClient, nodeConfiguration, _, sshClient, repositories) {
    return {
        revertToState: desiredStateName => {
            return api.newPromise((resolve, reject) => {
                var desiredState = _.findWhere(nodeConfiguration.states, {name: desiredStateName});
                if(desiredState==null) reject(new Error(`Invalid state requested for node ${nodeConfiguration.name}. Requested State Name: ${desiredStateName}`));
                else if(desiredState.snapshotId==null) reject(new Error(`Requested state for node ${nodeConfiguration.name} had no snapshotID. Requested State Name: ${desiredStateName}`));
                else {
                    resolve(esxiClient.restoreSnapshot(nodeConfiguration.esxiId, desiredState.snapshotId));
                }
            });
        },
        verifyMapRNotInstalled: () => {
            return api.newPromise((resolve, reject) => {
                sshClient.connect(nodeConfiguration.host, nodeConfiguration.username, nodeConfiguration.password).done(
                    sshSession => sshSession.executeCommands(['ls /opt/mapr']).done(
                        output => {
                            var errorMessage = 'No such file or directory';
                            if(output.indexOf(errorMessage)>=0) resolve();
                            else reject(`Check for nonexistence of /opt/mapr failed: ${output}`);
                        },
                        reject
                    ),
                    reject
                )
            });
        },
        isHostingService: serviceName => {
            return _.findWhere(nodeConfiguration.services, {name: serviceName}) != null;
        },
        //serviceNames: function() {
        //    return nodeConfiguration.services.map(service=>service.name);
        //},
        host: () => nodeConfiguration.host,
        username: () => nodeConfiguration.username,
        password: () => nodeConfiguration.password,
        operatingSystem: () => nodeConfiguration.operatingSystem,
        packageCommand: function() { return repositories.packageCommandFor(this.operatingSystem()); },
        repositoryURLFor: function(componentName) { return repositories.repositoryURLFor(this.operatingSystem(), componentName); },
        urlFor: function(componentName) {

            //TODO: The url / ports should come from UI Installer if possible

            var url = {
                'mapr-elasticsearch': `http://${this.host()}:9200`,
                'GUI Installer': `https://${this.host()}:9443`
            }[componentName];
            if(url==null) throw new Error(`url not found for component: ${componentName}`);
            return url;
        }
    }
}
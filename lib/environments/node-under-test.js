module.exports = function(api, nodeConfiguration, sshClient, repositories, _) {
    function getShellSession() {
        return sshClient.connect(nodeConfiguration.host, nodeConfiguration.username, nodeConfiguration.password);
    }
    return {
        nodeConfiguration: () => nodeConfiguration,
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
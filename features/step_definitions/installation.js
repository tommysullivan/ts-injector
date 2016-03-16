module.exports = function() {

    this.Given(/^I have installed Spyglass$/, function() {
        //TODO: Validate that spyglass installation has occurred for this ticket
    });

    this.When(/^I ssh into the node hosting "([^"]*)"$/, function (serviceName, callback) {
        this.sshServiceHost = this.clusterUnderTest.nodeHosting(serviceName);
        if(this.sshServiceHost==null) callback(new Error(`No node found that hosts ${serviceName}`));
        else {
            this.api.newSSHClient().connect(
                this.sshServiceHost.host(),
                this.sshServiceHost.username(),
                this.sshServiceHost.password()
            ).done(
                sshSession => { this.sshSession = sshSession; callback(); },
                callback
            );
        }
    });

    this.When(/^within my ssh session, I download "([^"]*)" to "([^"]*)" from the "([^"]*)" repo$/, function (fileToRetrieve, destinationDirectory, componentName, callback) {
        this.sshSession.executeCommands([
            `curl ${this.sshServiceHost.repositoryURLFor(componentName)}${fileToRetrieve} > ${destinationDirectory}${fileToRetrieve}`,
            `chmod 744 ${destinationDirectory}${fileToRetrieve}`
        ]).done(
            shellCommandResultSet => callback(),
            shellCommandResultSet => callback(shellCommandResultSet.toString())
        );
    });

    this.When(/^within my ssh session, I execute "([^"]*)"$/, { timeout: 10 * 60 * 1000 }, function (commandWithRepoPlaceholders, callback) {
        var command = commandWithRepoPlaceholders;
        command = command.replace('[installerRepoURL]', this.sshServiceHost.repositoryURLFor('GUI Installer'));
        command = command.replace('[maprCoreRepoURL]', this.sshServiceHost.repositoryURLFor('MapR Core'));
        command = command.replace('[ecosystemRepoURL]', this.sshServiceHost.repositoryURLFor('Ecosystem'));
        this.sshSession.executeCommand(command).done(
            shellCommandResult => {
                this.maprSetupOuptut = shellCommandResult;
                callback();
            },
            shellCommandResult => {
                callback(shellCommandResult.toString());
            }
        );
    });

    function guiInstallerURL() {
        var installerHost = this.clusterUnderTest.nodeHosting('GUI Installer');
        return installerHost.urlFor('GUI Installer');
    }

    function verifyGUIInstallerWebServerIsRunning(callback) {
        var url = guiInstallerURL.call(this);
        var path = '/';
        this.api.newRestClientAsPromised(url).get(path).done(
            success=>callback(),
            errorHttpResult=>callback(`Could not reach GUI Installer website. Status Code: ${errorHttpResult.statusCode}, url: ${url}${path}`)
        );
    }

    this.Then(/^it successfully starts the installer web server and outputs its URL to the screen$/, function (callback) {
        //if(this.maprSetupOuptut.indexOf('To continue installing MapR software, open the following URL in a web browser')==-1) callback(new Error(`Installation did not output the expected web browser URL text. Output: ${this.maprSetupOuptut}`));
        verifyGUIInstallerWebServerIsRunning.call(this, callback);
    });

    this.Given(/^the GUI Installer web server is running$/, function (callback) {
        verifyGUIInstallerWebServerIsRunning.call(this, callback);
    });

    this.Given(/^I can authenticate my GUI Installer Rest Client$/, function (callback) {
        var installerRESTClient = this.api.newInstallerRESTClient(guiInstallerURL.call(this));
        installerRESTClient.createAutheticatedSession('mapr','mapr').then(
            installerRESTSession => this.installerRESTSession = installerRESTSession
        ).done(
            success=>callback(),
            error=>callback(error)
        );
    });

    this.When(/^I specify the desired Cluster Configuration$/, function (callback) {
        return this.clusterUnderTest.installViaRESTInstaller(this.installerRESTSession)
            .done(
                success => callback(),
                callback
            );
    });

    function performInstallProcess(processMethodName, successBooleanPropName, callback) {
        this.installerRESTSession.process()
            .then(installerProcess => installerProcess[processMethodName]())
            .done(
                success=>{this[successBooleanPropName] = true; callback()},
                callback
            );
    }

    function validateProcessAndGetLogsOnError(successBooleanPropName, callback) {
        if(this[successBooleanPropName]) callback();
        else {
            this.installerRESTSession.process()
                .then(installerProcess => installerProcess.log())
                .done(
                    logText=>callback(logText),
                    error=>callback('There was an error with process and in addition could not retrieve logs. Http status: '+error.statusCode)
                );
        }
    }

    this.When(/^I perform Cluster Configuration Verification$/, function (callback) {
        performInstallProcess.call(this, 'validate', 'installerVerificationComplete', callback);
    });

    this.Then(/^Cluster Configuration Verification completes without errors$/, function (callback) {
        validateProcessAndGetLogsOnError.call(this, 'installerVerificationComplete', callback);
    });

    this.When(/^I perform Cluster Provisioning$/, function (callback) {
        performInstallProcess.call(this, 'provision', 'installerProvisioningComplete', callback);
    });

    this.Then(/^Cluster Provisioning completes without errors$/, function (callback) {
        validateProcessAndGetLogsOnError.call(this, 'installerProvisioningComplete', callback);
    });

    this.When(/^I perform Cluster Installation$/, {timeout: 15 * 60 * 1000}, function (callback) {
        performInstallProcess.call(this, 'install', 'installationComplete', callback);
    });

    this.Then(/^Cluster Installation completes without errors$/, function (callback) {
        validateProcessAndGetLogsOnError.call(this, 'installationComplete', callback);
    });
}
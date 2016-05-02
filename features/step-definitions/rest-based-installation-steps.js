"use strict";
module.exports = function () {
    this.Given(/^I can authenticate my GUI Installer Rest Client$/, function () {
        var _this = this;
        var installerSessionRequest = $.clusterUnderTest.newAuthedInstallerSession()
            .then(function (s) { return _this.installerSession = s; });
        return $.expect(installerSessionRequest).to.eventually.be.fulfilled;
    });
    this.Given(/^I specify and save the desired Cluster Configuration$/, function () {
        var serverConfigSaveRequest = $.clusterTesting.newClusterInstaller().prepareAndSaveConfiguration($.clusterUnderTest);
        return $.expect(serverConfigSaveRequest).to.eventually.be.fulfilled;
    });
    this.When(/^I perform Cluster Configuration Verification$/, function () {
        var _this = this;
        var installerSession = this.installerSession;
        var verificationRequest = installerSession.process()
            .then(function (p) {
            _this.installerProcess = p;
            return p.validate();
        });
        return $.expect(verificationRequest).to.eventually.be.fulfilled;
    });
    this.When(/^I perform Cluster Provisioning$/, function () {
        var installerProcess = this.installerProcess;
        return $.expect(installerProcess.provision()).to.eventually.be.fulfilled;
    });
    var timeout = $.clusterUnderTest.installationTimeoutInMilliseconds;
    this.When(/^I perform Cluster Installation$/, { timeout: timeout }, function () {
        // TODO: Where is the correct place for installationTimeout? Its probably the same place as all the other installation details.
        // This is not specific to the client, nor is it intrinsic part of the cluster. So instead, it can come from elsewhere. Should we
        // wish to vary it in the future, we can do so easily; for now assume one is in the configuration.
        // get installationTimeout():number { return this.configJSON.numericPropertyNamed('installationTimeout'); }
        var installerProcess = this.installerProcess;
        return $.expect(installerProcess.install()).to.eventually.be.fulfilled;
    });
};
//# sourceMappingURL=rest-based-installation-steps.js.map
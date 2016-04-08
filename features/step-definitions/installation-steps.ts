import Framework from "../../lib/framework/framework";
import IInstallerRestSession from "../../lib/installer/i-installer-rest-session";
import InstallerProcess from "../../lib/installer/installer-process";
declare var $:Framework;
declare var module:any;

module.exports = function() {
    this.Given(/^I can authenticate my GUI Installer Rest Client$/, function () {
        var installerSessionRequest = $.clusterUnderTest.newAuthedInstallerSession()
            .then(s=>this.installerSession = s);
        return $.expect(installerSessionRequest).to.eventually.be.fulfilled;
    });

    this.Given(/^I specify and save the desired Cluster Configuration$/, function () {
        var serverConfigSaveRequest = $.clusterTesting.newClusterInstaller().prepareAndSaveConfiguration(
            $.clusterUnderTest
        );
        return $.expect(serverConfigSaveRequest).to.eventually.be.fulfilled;
    });

    this.When(/^I perform Cluster Configuration Verification$/, function () {
        var installerSession:IInstallerRestSession = this.installerSession;
        var verificationRequest = installerSession.process()
            .then(p=>{
                this.installerProcess = p;
                return p.validate();
            });
        return $.expect(verificationRequest).to.eventually.be.fulfilled;
    });

    this.When(/^I perform Cluster Provisioning$/, function () {
        var installerProcess:InstallerProcess = this.installerProcess;
        return $.expect(installerProcess.provision()).to.eventually.be.fulfilled;
    });

    var timeout = $.clusterUnderTest.installationTimeoutInMilliseconds;
    this.When(/^I perform Cluster Installation$/, { timeout: timeout }, function () {
        // TODO: Where is the correct place for installationTimeout? Its probably the same place as all the other installation details.
        // This is not specific to the client, nor is it intrinsic part of the cluster. So instead, it can come from elsewhere. Should we
        // wish to vary it in the future, we can do so easily; for now assume one is in the configuration.
        
        // get installationTimeout():number { return this.configJSON.numericPropertyNamed('installationTimeout'); }
        var installerProcess:InstallerProcess = this.installerProcess;
        return $.expect(installerProcess.install()).to.eventually.be.fulfilled;
    });
}
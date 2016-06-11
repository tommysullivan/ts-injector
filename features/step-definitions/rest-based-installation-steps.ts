import { binding as steps, given, when, then } from "cucumber-tsflow";
import Framework from "../../lib/framework/framework";
import PromisedAssertion = Chai.PromisedAssertion;
import IInstallerRestSession from "../../lib/installer/i-installer-rest-session";
import ISSHResult from "../../lib/ssh/i-ssh-result";
import InstallerProcess from "../../lib/installer/installer-process";
declare var $:Framework;
declare var module:any;

@steps()
export default class RestBasedInstallationSteps {
    private installerSession:IInstallerRestSession;
    private sshResult:ISSHResult;
    private installerProcess:InstallerProcess;

    @given(/^I can authenticate my GUI Installer Rest Client$/)
    authenticateGUIInstallerRestClient():PromisedAssertion {
        var installerSessionRequest = $.clusterUnderTest.newAuthedInstallerSession()
            .then(s=>this.installerSession = s);
        return $.expect(installerSessionRequest).to.eventually.be.fulfilled;
    }

    @given(/^I specify and save the desired Cluster Configuration$/)
    saveDesiredClusterConfiguration():PromisedAssertion {
        var serverConfigSaveRequest = $.clusterTesting.newClusterInstaller().prepareAndSaveConfiguration(
            $.clusterUnderTest
        );
        return $.expect(serverConfigSaveRequest).to.eventually.be.fulfilled;
    }

    @when(/^I perform Cluster Configuration Verification$/)
    performClusterConfigurationVerification():PromisedAssertion {
        var verificationRequest = this.installerSession.process()
            .then(p=>{
                this.installerProcess = p;
                return p.validate();
            });
        return $.expect(verificationRequest).to.eventually.be.fulfilled;
    }

    @then(/^it successfully starts the installer web server and outputs its URL to the screen$/)
    verifyInstallerWebServerStartsAndOutputsURLToStdOut():void {
        var sshOutput = this.sshResult.processResult().stdoutLines().join('');
        $.expect(
            sshOutput.indexOf(
                'To continue installing MapR software, open the following URL in a web browser'
            )
        ).not.to.equal(-1);
    }

    @when(/^I perform Cluster Provisioning$/)
    performClusterProvisioning():PromisedAssertion {
        return $.expect(this.installerProcess.provision()).to.eventually.be.fulfilled;
    }

    @when(/^I perform Cluster Installation$/)
    performClusterInstallation():PromisedAssertion {
        return $.expect(this.installerProcess.install()).to.eventually.be.fulfilled;
    }
}
module.exports = RestBasedInstallationSteps;
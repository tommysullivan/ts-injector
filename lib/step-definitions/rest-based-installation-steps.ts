import { binding as steps, given, when, then } from "cucumber-tsflow";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {Framework} from "../framework/framework";
import {IInstallerRestSession} from "../installer/i-installer-rest-session";
import {ISSHResult} from "../ssh/i-ssh-result";
import {InstallerProcess} from "../installer/installer-process";

declare const $:Framework;
declare const module:any;

@steps()
export class RestBasedInstallationSteps {
    private installerSession:IInstallerRestSession;
    private sshResult:ISSHResult;
    private installerProcess:InstallerProcess;

    @given(/^I can authenticate my GUI Installer Rest Client$/)
    authenticateGUIInstallerRestClient():PromisedAssertion {
        const installerSessionRequest = $.clusterUnderTest.newAuthedInstallerSession()
            .then(s=>this.installerSession = s);
        return $.expect(installerSessionRequest).to.eventually.be.fulfilled;
    }

    @given(/^I specify and save the desired Cluster Configuration$/)
    saveDesiredClusterConfiguration():PromisedAssertion {
        const serverConfigSaveRequest = $.clusterTesting.newClusterInstaller().prepareAndSaveConfiguration(
            $.clusterUnderTest
        );
        return $.expect(serverConfigSaveRequest).to.eventually.be.fulfilled;
    }

    @when(/^I perform Cluster Configuration Verification$/)
    performClusterConfigurationVerification():PromisedAssertion {
        const verificationRequest = this.installerSession.process()
            .then(p=>{
                this.installerProcess = p;
                return p.validate();
            });
        return $.expect(verificationRequest).to.eventually.be.fulfilled;
    }

    @then(/^it successfully starts the installer web server and outputs its URL to the screen$/)
    verifyInstallerWebServerStartsAndOutputsURLToStdOut():void {
        const sshOutput = this.sshResult.processResult.allOutputLines.join('');
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
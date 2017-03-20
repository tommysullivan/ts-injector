import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {IInstallerRestSession} from "../installer/i-installer-rest-session";
import {ISSHResult} from "../ssh/i-ssh-result";
import {InstallerProcess} from "../installer/installer-process";

declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {
    let installerSession:IInstallerRestSession;
    let sshResult:ISSHResult;
    let installerProcess:InstallerProcess;


    this.Before(function () {
        installerSession = undefined;
        sshResult = undefined;
        installerProcess = undefined;
    });

    this.Given(/^I can authenticate my GUI Installer Rest Client$/, ():PromisedAssertion => {
        const installerSessionRequest = $.clusterUnderTest.newAuthedInstallerSession()
            .then(s=>installerSession = s);
        return $.expect(installerSessionRequest).to.eventually.be.fulfilled;
    });

    this.Given(/^I specify and save the desired Cluster Configuration$/, ():PromisedAssertion => {
        const serverConfigSaveRequest = $.clusters.newClusterInstaller().prepareAndSaveConfiguration(
            $.clusterUnderTest
        );
        return $.expect(serverConfigSaveRequest).to.eventually.be.fulfilled;
    });

    this.When(/^I perform Cluster Configuration Verification$/, ():PromisedAssertion => {
        const verificationRequest = installerSession.process()
            .then(p=>{
                installerProcess = p;
                return p.validate();
            });
        return $.expect(verificationRequest).to.eventually.be.fulfilled;
    });

    this.Then(/^it successfully starts the installer web server and outputs its URL to the screen$/, ():void => {
        const sshOutput = sshResult.processResult.allOutputLines.join('');
        $.expect(
            sshOutput.indexOf(
                'To continue installing MapR software, open the following URL in a web browser'
            )
        ).not.to.equal(-1);
    });

    this.When(/^I perform Cluster Provisioning$/, ():PromisedAssertion => {
        return $.expect(installerProcess.provision()).to.eventually.be.fulfilled;
    });

    this.When(/^I perform Cluster Installation$/, ():PromisedAssertion => {
        return $.expect(installerProcess.install()).to.eventually.be.fulfilled;
    });
};
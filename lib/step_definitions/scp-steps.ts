import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";

declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {

    this.When(/^I scp "([^"]*)" to "([^"]*)" at path "([^"]*)"$/, (sourceFilePath, destinationHost, destinationFilePath):PromisedAssertion => {
        const scpRequest = $.sshAPI.newSSHClient().connect(destinationHost, 'root', 'mapr')
            .then(s=>s.upload(sourceFilePath, destinationFilePath));
        return $.expect(scpRequest).to.eventually.be.fulfilled;
    });

    this.When(/^I download "([^"]*)" from "([^"]*)" to "([^"]*)"$/, (remotePath, remoteHost, localPath):PromisedAssertion  => {
        const scpRequest = $.sshAPI.newSSHClient().connect(remoteHost, 'root', 'mapr')
            .then(s=>s.download(remotePath, localPath));
        return $.expect(scpRequest).to.eventually.be.fulfilled;
    });

    this.When(/^I write "([^"]*)" to "([^"]*)" at path "([^"]*)"$/, (content, remoteHost, destPath):PromisedAssertion  => {
        const scpRequest = $.sshAPI.newSSHClient().connect(remoteHost, 'root', 'mapr')
            .then(s=>s.write(content, destPath));
        return $.expect(scpRequest).to.eventually.be.fulfilled;
    });
};
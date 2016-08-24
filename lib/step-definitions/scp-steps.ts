import { binding as steps, given, when, then } from "cucumber-tsflow";
import Framework from "../framework/framework";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
declare const $:Framework;
declare const module:any;

@steps()
export default class SCPSteps {

    @when(/^I scp "([^"]*)" to "([^"]*)" at path "([^"]*)"$/)
    scpToRemoteHost(sourceFilePath, destinationHost, destinationFilePath):PromisedAssertion {
        const scpRequest = $.sshAPI.newSSHClient().connect(destinationHost, 'root', 'mapr')
            .then(s=>s.upload(sourceFilePath, destinationFilePath));
        return $.expect(scpRequest).to.eventually.be.fulfilled;
    }

    @when(/^I download "([^"]*)" from "([^"]*)" to "([^"]*)"$/)
    downloadRemoteFileToLocalFilePath(remotePath, remoteHost, localPath):PromisedAssertion {
        const scpRequest = $.sshAPI.newSSHClient().connect(remoteHost, 'root', 'mapr')
            .then(s=>s.download(remotePath, localPath));
        return $.expect(scpRequest).to.eventually.be.fulfilled;
    }

    @when(/^I write "([^"]*)" to "([^"]*)" at path "([^"]*)"$/)
    writeStringContentFromMemoryToRemoteHost(content, remoteHost, destPath):PromisedAssertion {
        const scpRequest = $.sshAPI.newSSHClient().connect(remoteHost, 'root', 'mapr')
            .then(s=>s.write(content, destPath));
        return $.expect(scpRequest).to.eventually.be.fulfilled;
    }
}
module.exports = SCPSteps;
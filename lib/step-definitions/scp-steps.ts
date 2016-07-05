import { binding as steps, given, when, then } from "cucumber-tsflow";
import Framework from "../../lib/framework/framework";
import {PromisedAssertion} from "../../lib/chai-as-promised/promised-assertion";
declare var $:Framework;
declare var module:any;

@steps()
export default class SCPSteps {

    @when(/^I scp "([^"]*)" to "([^"]*)" at path "([^"]*)"$/)
    scpToRemoteHost(sourceFilePath, destinationHost, destinationFilePath):PromisedAssertion {
        var scpRequest = $.sshAPI.newSSHClient().connect(destinationHost, 'root', 'mapr')
            .then(s=>s.upload(sourceFilePath, destinationFilePath));
        return $.expect(scpRequest).to.eventually.be.fulfilled;
    }

    @when(/^I download "([^"]*)" from "([^"]*)" to "([^"]*)"$/)
    downloadRemoteFileToLocalFilePath(remotePath, remoteHost, localPath):PromisedAssertion {
        var scpRequest = $.sshAPI.newSSHClient().connect(remoteHost, 'root', 'mapr')
            .then(s=>s.download(remotePath, localPath));
        return $.expect(scpRequest).to.eventually.be.fulfilled;
    }

    @when(/^I write "([^"]*)" to "([^"]*)" at path "([^"]*)"$/)
    writeStringContentFromMemoryToRemoteHost(content, remoteHost, destPath):PromisedAssertion {
        var scpRequest = $.sshAPI.newSSHClient().connect(remoteHost, 'root', 'mapr')
            .then(s=>s.write(content, destPath));
        return $.expect(scpRequest).to.eventually.be.fulfilled;
    }
}
module.exports = SCPSteps;
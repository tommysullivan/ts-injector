import Framework from "../../lib/framework/framework";
declare var $:Framework;
declare var module:any;

module.exports = function() {
    this.When(/^I scp "([^"]*)" to "([^"]*)" at path "([^"]*)"$/, function (source, destHost, destPath) {
        var scpRequest = $.sshAPI.newSSHClient().connect(destHost, 'root', 'mapr')
            .then(s=>s.upload(source, destPath));
        return $.expect(scpRequest).to.eventually.be.fulfilled;
    });

    this.When(/^I download "([^"]*)" from "([^"]*)" to "([^"]*)"$/, function (remotePath, remoteHost, localPath) {
        var scpRequest = $.sshAPI.newSSHClient().connect(remoteHost, 'root', 'mapr')
            .then(s=>s.download(remotePath, localPath));
        return $.expect(scpRequest).to.eventually.be.fulfilled;
    });

    this.When(/^I write "([^"]*)" to "([^"]*)" at path "([^"]*)"$/, function (content, remoteHost, destPath) {
        var scpRequest = $.sshAPI.newSSHClient().connect(remoteHost, 'root', 'mapr')
            .then(s=>s.write(content, destPath));
        return $.expect(scpRequest).to.eventually.be.fulfilled;
    });
}
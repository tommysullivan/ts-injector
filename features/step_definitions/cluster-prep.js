module.exports = function() {

    this.Given(/^I have automatically prepared a single node cluster as described by "([^"]*)"$/, function (featureFilePath, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I prepare it using automation described by "([^"]*)"$/, function (featureFilePath, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I have an esxi server running at "([^"]*)"$/, function (esxiServerHost) {
        this.esxiServerHost = esxiServerHost;
    });

    this.Given(/^the esxi username is "([^"]*)"$/, function (esxiUsername) {
        this.esxiUsername = esxiUsername;
    });

    this.Given(/^the esxi password is "([^"]*)"$/, function (esxiPassword) {
        this.esxiPassword = esxiPassword;
    });

    this.Given(/^the ID of the VM I'd like to prepare is "([^"]*)"$/, function (vmIdNumber) {
        this.vmIdNumber = vmIdNumber;
    });

    this.Given(/^the ID of the snapshot I'd like to apply is "([^"]*)"$/, function (vmSnapshotId) {
        this.vmSnapshotId = vmSnapshotId;
    });

    this.When(/^I apply the snapshot to the VM$/, function (callback) {
        this.runSSHCommands(this.esxiServerHost, this.esxiUsername, this.esxiPassword,
            [
                `vim-cmd vmsvc/snapshot.revert ${this.vmIdNumber} ${this.vmSnapshotId} 0`,
                `vim-cmd vmsvc/power.on ${this.vmIdNumber}`
            ],
            result => callback(),
            callback
        );
    });

    this.Then(/^I can connect to it and find that it does not have MapR installed$/, function (callback) {
        this.runSSHCommands('10.10.1.103', 'root', 'mapr',
            ['ls /opt/mapr'],
            result => {
                //console.log(result);
                var errorMessage = 'No such file or directory';
                if(result.indexOf(errorMessage)>=0) callback();
                else callback('/opt/mapr may exist - '+result);
            },
            callback
        );
    });

}
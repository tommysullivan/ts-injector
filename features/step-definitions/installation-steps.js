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
    this.Given(/^I prepare the disk\.list file$/, function () {
        var diskCommand = "sfdisk -l | grep \"/dev/sd[a-z]\" |grep -v \"/dev/sd[a-z][0-9]\" | sort |cut -f2 -d' ' | tr \":\" \" \" | awk '{if(NR>1)print}' > /root/disk.list";
        var result = $.clusterUnderTest.executeShellCommandOnEachNode(diskCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    });
    this.Given(/^I run configure\.sh on all nodes$/, function () {
        var cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(function (n) { return n.host; }).join(',');
        var zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(function (n) { return n.host; }).join(',');
        var historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        var configCommand = "/opt/mapr/server/configure.sh -C " + cldbHostsString + " -Z " + zookeeperHostsString + " -HS " + historyHostString + " -u mapr -g mapr -N " + $.clusterUnderTest.name + " -F /root/disk.list";
        var result = $.clusterUnderTest.executeShellCommandOnEachNode(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    });
    this.Given(/^I install the license on cluster$/, function () {
        var downloadLicense = "wget http://maprqa:maprqa@stage.mapr.com/license/LatestDemoLicense-M7.txt";
        var licenseCommand = "maprcli license add -license LatestDemoLicense-M7.txt -is_file true";
        var result = $.clusterUnderTest.nodes().first().executeShellCommands($.collections.newList([downloadLicense, licenseCommand]));
        return $.expect(result).to.eventually.be.fulfilled;
    });
    this.Given(/^I restart the warden$/, function () {
        var result = $.clusterUnderTest.executeShellCommandOnEachNode("service mapr-warden restart");
        return $.expect(result).to.eventually.be.fulfilled;
    });
    this.Given(/^I run configure\.sh for spyglass components$/, { timeout: 1000 * 60 * 20 }, function () {
        var cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(function (n) { return n.host; }).join(',');
        var zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(function (n) { return n.host; }).join(',');
        var opentsdbHostsString = $.clusterUnderTest.nodesHosting('mapr-opentsdb').map(function (n) { return n.host; }).join(',');
        var elasticsearchHostsString = $.clusterUnderTest.nodesHosting('mapr-elasticsearch').map(function (n) { return n.host; }).join(',');
        var configCommand = "/opt/mapr/server/configure.sh -C " + cldbHostsString + " -Z " + zookeeperHostsString + " -OT " + opentsdbHostsString + " -ES " + elasticsearchHostsString + " -N " + $.clusterUnderTest.name;
        var result = $.clusterUnderTest.executeShellCommandOnEachNode(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    });
};
//# sourceMappingURL=installation-steps.js.map
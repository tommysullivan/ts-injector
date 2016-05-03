"use strict";
module.exports = function () {
    this.Given(/^I have updated the package manager$/, function () {
        var result = $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes().map(function (n) { return n.executeShellCommand(n.repo.packageUpdateCommand); }));
        return $.expect(result).to.eventually.be.fulfilled;
    });
    this.When(/^I install the Core components$/, { timeout: 1000 * 60 * 20 }, function () {
        var commandPromises = $.clusterUnderTest.nodes().map(function (n) {
            var coreServices = $.versioning.serviceSet().filter(function (s) { return n.isHostingService(s.name) && s.isCore; });
            var installOptions = n.repo.type == 'apt-get' ? '--allow-unauthenticated' : '';
            var command = n.repo.packageCommand + " install -y " + coreServices.map(function (s) { return s.name; }).join(' ') + " " + installOptions;
            return n.executeShellCommand(command);
        });
        var result = $.promiseFactory.newGroupPromise(commandPromises);
        return $.expect(result).to.eventually.be.fulfilled;
    });
    this.Given(/^I install all spyglass components$/, { timeout: 1000 * 60 * 20 }, function () {
        var commandPromises = $.clusterUnderTest.nodes().map(function (n) {
            var spyglassServices = $.versioning.serviceSet().filter(function (s) { return n.isHostingService(s.name) && !s.isCore; });
            var installOptions = n.repo.type == 'apt-get' ? '--allow-unauthenticated' : '';
            var command = n.repo.packageCommand + " install -y " + spyglassServices.map(function (s) { return s.name; }).join(' ') + " " + installOptions;
            return n.executeShellCommand(command);
        });
        var result = $.promiseFactory.newGroupPromise(commandPromises);
        return $.expect(result).to.eventually.be.fulfilled;
    });
    this.Then(/^all health checkable services are healthy$/, function () {
        var healthCheckableServices = $.versioning.serviceSet()
            .filter(function (s) { return s.isHealthCheckable && $.clusterUnderTest.nodesHosting(s.name).notEmpty(); });
        var unhealthyServicesRequest = $.clusterUnderTest.newAuthedMCSSession()
            .then(function (mcsSession) { return mcsSession.dashboardInfo(); })
            .then(function (dashboardInfo) {
            var unhealthyOrAbsentServices = healthCheckableServices.filter(function (healthCheckableService) {
                var matchingServiceInMCS = dashboardInfo.services().firstWhere(function (mcsService) { return "mapr-" + mcsService.name == healthCheckableService.name; }, "MCS service named " + healthCheckableService.name + " was not found");
                return !matchingServiceInMCS.isHealthy;
            });
            return unhealthyOrAbsentServices;
        });
        unhealthyServicesRequest.then(function (u) { return console.log(u.toJSONString()); });
        return $.expect(unhealthyServicesRequest.then(function (a) { return a.toArray(); })).to.eventually.be.empty;
    });
    this.Given(/^I prepare each node in the cluster with the correct repo configuration$/, function () {
        var nodePromises = $.clusterUnderTest.nodes().map(function (n) {
            var isYum = n.repo.type == 'yum';
            var destinationPath = isYum ? '/etc/yum.repos.d/' : '/etc/apt/sources.list.d/';
            var repoFileName = isYum ? 'mapr-yum.repo' : 'mapr-apt-get.list';
            var ecosystemFileName = isYum ? 'ecosystem-yum.repo' : 'ecosystem-apt-get.list';
            return $.promiseFactory.newGroupPromiseFromArray([
                n.executeCopyCommand("data/testing-resources/" + repoFileName, "" + destinationPath + repoFileName),
                n.executeCopyCommand("data/testing-resources/" + ecosystemFileName, "" + destinationPath + ecosystemFileName)
            ]);
        });
        var everythingPromise = $.promiseFactory.newGroupPromise(nodePromises);
        return $.expect(everythingPromise).to.eventually.be.fulfilled;
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
        var removeLicenseCommand = "rm -f LatestDemoLicense-M7.txt";
        var result = $.clusterUnderTest.nodes().first().executeShellCommands($.collections.newList([downloadLicense, licenseCommand, removeLicenseCommand]));
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
    this.Given(/^I have installed Java$/, { timeout: 1000 * 60 * 7 }, function () {
        var nodePromises = $.clusterUnderTest.nodes().map(function (n) {
            var isYum = n.repo.type == 'yum';
            return n.executeShellCommand(isYum ? 'yum install -y java' : 'apt-get install -y default-jre');
        });
        return $.expect($.promiseFactory.newGroupPromise(nodePromises)).to.eventually.be.fulfilled;
    });
    this.Given(/^the cluster has MapR Installed$/, function () {
        // var commandPromises =  $.clusterUnderTest.nodes().map(n=>{ return n.verifyMapRIsInstalled()});
        // var result = $.promiseFactory.newGroupPromise(commandPromises);
        var result = $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes().map(function (n) { return n.verifyMapRIsInstalled(); }));
        return $.expect(result).to.eventually.be.fulfilled;
    });
    this.Given(/^I remove all spyglass components$/, function () {
        var commandPromises = $.clusterUnderTest.nodes().map(function (n) {
            var spyglassServices = $.versioning.serviceSet().filter(function (s) { return n.isHostingService(s.name) && !s.isCore; });
            var removeOption = n.repo.type == 'apt-get' ? "purge -y" : "remove -y";
            var command = n.repo.packageCommand + " " + removeOption + " " + spyglassServices.map(function (s) { return s.name; }).join(' ');
            return n.executeShellCommand(command);
        });
        var result = $.promiseFactory.newGroupPromise(commandPromises);
        return $.expect(result).to.eventually.be.fulfilled;
    });
    this.Given(/^I remove all the core components$/, function () {
        var commandPromises = $.clusterUnderTest.nodes().map(function (n) {
            var coreServices = $.versioning.serviceSet().filter(function (s) { return n.isHostingService(s.name) && s.isCore; });
            var removeOption = n.repo.type == 'apt-get' ? "autoremove -y" : "autoremove -y";
            var command = n.repo.packageCommand + " " + removeOption + " " + coreServices.map(function (s) { return s.name; }).join(' ');
            return n.executeShellCommand(command);
        });
        var result = $.promiseFactory.newGroupPromise(commandPromises);
        return $.expect(result).to.eventually.be.fulfilled;
    });
    this.Given(/^I clear all mapr data$/, function () {
        var cmdPromises = $.clusterUnderTest.nodes().map(function (n) {
            var cmdList = $.collections.newEmptyList();
            cmdList.push('rm -rfv /tmp/hadoop*');
            cmdList.push("rm -rfv /opt/mapr");
            cmdList.push("rm -rfv /opt/cores/*");
            cmdList.push("rm -rf /var/mapr-zookeeper-data");
            return n.executeShellCommands(cmdList);
        });
        var result = $.promiseFactory.newGroupPromise(cmdPromises);
        return $.expect(result).to.eventually.be.fulfilled;
    });
};
//# sourceMappingURL=package-manager-installation-steps.js.map
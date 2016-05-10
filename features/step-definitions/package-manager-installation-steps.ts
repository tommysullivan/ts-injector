import Framework from "../../lib/framework/framework";
import MCSDashboardInfo from "../../lib/mcs/mcs-dashboard-info";
declare var $:Framework;
declare var module:any;

module.exports = function() {
    this.Given(/^I have updated the package manager$/, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>n.executeShellCommand(n.repo.packageUpdateCommand))
        ).to.eventually.be.fulfilled;
    });

    this.When(/^I install the Core components$/, { timeout: 1000 * 60 * 20 }, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>{
                var coreServices = $.versioning.serviceSet().filter(s=>n.isHostingService(s.name) && s.isCore);
                var command = n.repo.installPackagesCommand(coreServices.map(s=>s.name));
                return n.executeShellCommand(command);
            })
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I prepare each node with the patch repo configuration$/, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>{
                return n.executeCopyCommand(`data/testing-resources/${n.repo.patchRepoFileName}`, `${n.repo.repoConfigDirectory}${n.repo.patchRepoFileName}`);
            })
        ).to.eventually.be.fulfilled;
    });

    this.When(/^I install the latest patch$/, { timeout: 1000 * 60 * 20 }, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n => {
                var command = n.repo.installPackageCommand('mapr-patch');
                return n.executeShellCommand(command);
            })
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I install all spyglass components$/, { timeout: 1000 * 60 * 20 }, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>{
                var spyglassServices = $.versioning.serviceSet().filter(s=>n.isHostingService(s.name) && !s.isCore);
                var command = n.repo.installPackagesCommand(spyglassServices.map(s=>s.name));
                return n.executeShellCommand(command);
            })
        ).to.eventually.be.fulfilled;
    });

    this.Then(/^all health checkable services are healthy$/, function () {
        var healthCheckableServices = $.versioning.serviceSet()
            .filter(s=>s.isHealthCheckable && $.clusterUnderTest.nodesHosting(s.name).notEmpty());

        var unhealthyServicesRequest = $.clusterUnderTest.newAuthedMCSSession()
            .then(mcsSession=>mcsSession.dashboardInfo())
            .then((dashboardInfo:MCSDashboardInfo)=>{
                var unhealthyOrAbsentServices = healthCheckableServices.filter(healthCheckableService=>{
                    var matchingServiceInMCS = dashboardInfo.services().firstWhere(
                        mcsService=>`mapr-${mcsService.name}`==healthCheckableService.name,
                        `MCS service named ${healthCheckableService.name} was not found`
                    );
                    return !matchingServiceInMCS.isHealthy;
                });
                return unhealthyOrAbsentServices;
            });
        unhealthyServicesRequest.then(u=>console.log(u.toJSONString()));
        return $.expect(unhealthyServicesRequest.then(a=>a.toArray())).to.eventually.be.empty;
    });

    this.Given(/^I prepare each node in the cluster with the correct repo configuration$/, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>{
                return $.promiseFactory.newGroupPromiseFromArray([
                    n.executeCopyCommand(`data/testing-resources/${n.repo.coreRepoFileName}`, `${n.repo.repoConfigDirectory}${n.repo.coreRepoFileName}`),
                    n.executeCopyCommand(`data/testing-resources/${n.repo.ecosystemRepoFileName}`, `${n.repo.repoConfigDirectory}${n.repo.ecosystemRepoFileName}`)
                ]);
            })
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I prepare the disk\.list file$/, function () {
        var diskCommand = `sfdisk -l | grep "/dev/sd[a-z]" |grep -v "/dev/sd[a-z][0-9]" | sort |cut -f2 -d' ' | tr ":" " " | awk '{if(NR>1)print}' > /root/disk.list`;
        var result = $.clusterUnderTest.executeShellCommandOnEachNode(diskCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I run configure\.sh on all nodes$/, {timeout: 10 * 1000 * 60}, function () {
        var cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(n=>n.host).join(',');
        var zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=>n.host).join(',');
        var historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        var configCommand =`/opt/mapr/server/configure.sh -C ${cldbHostsString} -Z ${zookeeperHostsString} -HS ${historyHostString} -u mapr -g mapr -N ${$.clusterUnderTest.name} -F /root/disk.list`
        var result = $.clusterUnderTest.executeShellCommandOnEachNode(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I install the license on cluster$/, function () {
        var downloadLicense = `wget http://maprqa:maprqa@stage.mapr.com/license/LatestDemoLicense-M7.txt`;
        var licenseCommand = `maprcli license add -license LatestDemoLicense-M7.txt -is_file true`;
        var removeLicenseCommand = `rm -f LatestDemoLicense-M7.txt`;
        var result = $.clusterUnderTest.nodes().first().executeShellCommands(
            $.collections.newList([downloadLicense, licenseCommand, removeLicenseCommand])
        );
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I restart the warden$/, function () {
        var result = $.clusterUnderTest.executeShellCommandOnEachNode(`service mapr-warden restart`);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I run configure\.sh for spyglass components$/, { timeout: 1000 * 60 * 20 }, function () {
        var cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(n=>n.host).join(',');
        var zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=>n.host).join(',');
        var opentsdbHostsString = $.clusterUnderTest.nodesHosting('mapr-opentsdb').map(n=>n.host).join(',');
        var elasticsearchHostsString = $.clusterUnderTest.nodesHosting('mapr-elasticsearch').map(n=>n.host).join(',');
        var configCommand =`/opt/mapr/server/configure.sh -OT ${opentsdbHostsString} -ES ${elasticsearchHostsString} -R`;
        var result = $.clusterUnderTest.executeShellCommandOnEachNode(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I have installed Java$/, { timeout: 1000 * 60 * 40 }, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>n.executeShellCommand(n.repo.installJavaCommand))
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I use the package manager to install the "([^"]*)" package$/, function (packageName) {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>n.executeShellCommand(n.repo.installPackageCommand(packageName)))
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^the cluster has MapR Installed$/, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n => n.verifyMapRIsInstalled())
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I remove all spyglass components$/, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>{
                var spyglassServices = $.versioning.serviceSet().filter(s=>n.isHostingService(s.name) && !s.isCore);
                var command = n.repo.uninstallPackagesCommand(spyglassServices.map(s=>s.name));
                return n.executeShellCommand(command);
            })
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I remove all the core components$/, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>n.executeShellCommand(n.repo.uninstallCorePackagesCommand))
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I clear all mapr data$/, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().map( n => {
                var cmdList = $.collections.newEmptyList<string>();
                cmdList.push('rm -rfv /tmp/hadoop*');
                cmdList.push(`rm -rfv /opt/mapr`)
                cmdList.push(`rm -rfv /opt/cores/*`)
                cmdList.push(`rm -rf /var/mapr-zookeeper-data`)
                return n.executeShellCommands(cmdList);
            })
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I stop all zookeeper services$/, function () {
        return $.expectAll(
            $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=> {
                return n.executeShellCommand(`service mapr-zookeeper stop`);
            })
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I run loadTemplate one of the es nodes$/, function () {
        var esNode = $.clusterUnderTest.nodesHosting('mapr-elasticsearch').first();
        var nodeIp = esNode.host;
        var result = esNode.executeShellCommand(`/opt/mapr/elasticsearch/elasticsearch-2.2.0/bin/es_cluster_mgmt.sh -loadTemplate ${nodeIp}`);
        return $.expect(result).to.eventually.be.fulfilled;
    });

}

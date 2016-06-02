import Framework from "../../lib/framework/framework";
import MCSDashboardInfo from "../../lib/mcs/mcs-dashboard-info";
import Collections from "../../lib/collections/collections";
declare var $:Framework;
declare var module:any;

module.exports = function() {
    this.Given(/^I have updated the package manager$/, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>n.executeShellCommand(n.repository.packageUpdateCommand))
        ).to.eventually.be.fulfilled;
    });

    this.When(/^I install the Core components$/, { timeout: 1000 * 60 * 20 }, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>{
                var coreServices = $.versioning.serviceSet().filter(s=>n.isHostingService(s.name) && s.isCore);
                var command = n.repository.installPackagesCommand(coreServices.map(s=>s.name));
                return n.executeShellCommand(command);
            })
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I prepare each node with the patch repo configuration$/, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(
                n=>n.write(n.repoConfigFileContentFor('mapr-patch'), n.repoConfigFileLocationFor('mapr-patch'))
            )
        ).to.eventually.be.fulfilled;
    });

    this.When(/^I install the latest patch$/, { timeout: 1000 * 60 * 20 }, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n => {
                var command = n.repository.installPackageCommand('mapr-patch');
                return n.executeShellCommand(command);
            })
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I install all spyglass components$/, { timeout: 1000 * 60 * 20 }, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>{
                var spyglassServices = $.versioning.serviceSet().filter(s=>n.isHostingService(s.name) && !s.isCore);
                var command = n.repository.installPackagesCommand(spyglassServices.map(s=>s.name));
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
        return unhealthyServicesRequest.then(unhealthyServices=>{
            return $.assertEmptyList(unhealthyServices);
        });
    });

    this.Given(/^I prepare each node in the cluster with the correct repo configuration$/, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().flatMapArray(n=>
                ['core','ecosystem'].map(
                    c=>n.write(n.repoConfigFileContentFor(c),n.repoConfigFileLocationFor(c))
                )
            )
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
            $.clusterUnderTest.nodes().map(n=>n.executeShellCommand(n.repository.installJavaCommand))
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I use the package manager to install the "([^"]*)" package$/, function (packageName) {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>n.executeShellCommand(n.repository.installPackageCommand(packageName)))
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
                var command = n.repository.uninstallPackagesCommand(spyglassServices.map(s=>s.name));
                return n.executeShellCommand(command);
            })
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I remove all the core components$/, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>n.executeShellCommand(n.repository.uninstallCorePackagesCommand))
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

    this.Given(/^I remove the opensource repo$/, function () {
        return $.expectAll($.clusterUnderTest.nodes().map(n =>
            n.executeShellCommand(`rm -rf ${n.repository.configFileLocationFor('ecosystem')}`))
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I prepare each node with the spyglass repo configuration$/, function () {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(
                n=>n.write(n.repoConfigFileContentFor('spyglass'), n.repoConfigFileLocationFor('spyglass'))
            )
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I run configure\.sh with genkeys and nostart option on first cldb node$/, function () {
        this.cldb = $.clusterUnderTest.nodesHosting('mapr-cldb').first();
        var cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(n=>n.host).join(',');
        var zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=>n.host).join(',');
        var historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        var configCommand =`/opt/mapr/server/configure.sh -C ${cldbHostsString} -Z ${zookeeperHostsString} -HS ${historyHostString} -u mapr -g mapr -N ${$.clusterUnderTest.name} -F /root/disk.list -secure -genkeys -no-autostart`;
        var result = this.cldb.executeShellCommand(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I copy cldb key file to all other cldb nodes and zookeeper nodes$/, function () {
        var result = this.cldb.download('/opt/mapr/conf/cldb.key', './data/tmp/cldb.key')
            .then(n => $.clusterUnderTest.nodes().filter(n => n.isHostingService('mapr-cldb') || n.isHostingService('mapr-zookeeper'))
            .filter(n => n.host != this.cldb.host).map(node => node.upload('./data/tmp/cldb.key', '/opt/mapr/conf/cldb.key')))
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I copy maprserverticket, ssl_keystore, ssl_truststore to all nodes$/, function () {
        var result1 = this.cldb.download('/opt/mapr/conf/maprserverticket', 'data/tmp/maprserverticket')
            .then(_ => $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes()
                .filter(n => n.host != this.cldb.host).map(n => n.upload('data/tmp/maprserverticket', '/opt/mapr/conf/maprserverticket'))));

        var result2 = this.cldb.download('/opt/mapr/conf/ssl_keystore', 'data/tmp/ssl_keystore')
            .then(_ => $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes()
                .filter(n => n.host != this.cldb.host).map(n => n.upload('data/tmp/ssl_keystore', '/opt/mapr/conf/ssl_keystore'))));

        var result3 = this.cldb.download('/opt/mapr/conf/ssl_truststore', 'data/tmp/ssl_truststore')
            .then(_ => $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes()
                .filter(n => n.host != this.cldb.host).map(n => n.upload('data/tmp/ssl_truststore', '/opt/mapr/conf/ssl_truststore'))));

        return $.expectAll($.collections.newList([result1, result2, result3])).to.eventually.be.fulfilled;

    });

    this.Given(/^I run configure\.sh with secure option on all nodes except first cldb node$/, function () {
        var cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(n=>n.host).join(',');
        var zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=>n.host).join(',');
        var historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        var configCommand =`/opt/mapr/server/configure.sh -C ${cldbHostsString} -Z ${zookeeperHostsString} -HS ${historyHostString} -u mapr -g mapr -N ${$.clusterUnderTest.name} -F /root/disk.list -secure -no-autostart`;
        var result  = $.clusterUnderTest.nodes().filter(n => n.host != this.cldb.host).map(n => n.executeShellCommand(configCommand));
        return $.expectAll(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I start zookeeper on all the nodes$/, function () {
        return $.expectAll(
            $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=> {
                return n.executeShellCommand(`service mapr-zookeeper start`);
            })
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I run configure\.sh on all nodes without \-F$/, function () {
        var cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(n=>n.host).join(',');
        var zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=>n.host).join(',');
        var historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        var configCommand =`/opt/mapr/server/configure.sh -C ${cldbHostsString} -Z ${zookeeperHostsString} -HS ${historyHostString} -u mapr -g mapr -N ${$.clusterUnderTest.name}`;
        var result = $.clusterUnderTest.executeShellCommandOnEachNode(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I set the mfs instance to "([^"]*)"$/, function (mfsInstances) {
       $.clusterUnderTest.nodes().first().executeShellCommand(`maprcli config save -values '{"multimfs.numinstances.pernode":"${mfsInstances}}'`)
    });

    this.Given(/^I create the user "([^"]*)" with id "([^"]*)" group "([^"]*)" and password "([^"]*)"$/, function (user, userId, userGroup, userPasswd) {
        var userCreateComamnd = `id -u ${user} || useradd -u ${userId} -g ${userGroup} -p $(openssl passwd -1 ${userPasswd}) ${user}`;
        var groupCreateCommand = `getent group ${userGroup} || groupadd -g ${userId} ${user}`;
        var resultList = $.clusterUnderTest.nodes().map(n => n.executeShellCommands($.collections.newList([groupCreateCommand,userCreateComamnd])));
        return $.expectAll(resultList).to.eventually.be.fulfilled;
    });

    this.Given(/^I perform the following ssh commands on each node in the cluster as user "([^"]*)" with password "([^"]*)":$/, function (user, userPasswd, commands:string) {
        var commandList = $.collections.newList(commands.split("\n"));
        var nodeRequests = $.clusterUnderTest.nodes().map(n=>{
            return $.sshAPI.newSSHClient().connect(n.host, user, userPasswd)
                .then(session=>session.executeCommands(commandList))
        });
        return $.expectAll(nodeRequests).to.eventually.be.fulfilled;
    });
}

import Framework from "../../lib/framework/framework";
import MCSDashboardInfo from "../../lib/mcs/mcs-dashboard-info";
import IList from "../../lib/collections/i-list";
declare var $:Framework;
declare var module:any;

module.exports = function() {
    this.Given(/^I have updated the package manager$/, function () {
        var result = $.promiseFactory.newGroupPromise(
            $.clusterUnderTest.nodes().map(n=>n.executeShellCommand(n.repo.packageUpdateCommand))
        );
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.When(/^I install the Core components$/, { timeout: 1000 * 60 * 20 }, function () {
        var commandPromises = $.clusterUnderTest.nodes().map(n=>{
            var coreServices = $.versioning.serviceSet().filter(s=>n.isHostingService(s.name) && s.isCore);
            var installOptions = n.repo.type=='apt-get' ? '--allow-unauthenticated' : '';
            var command = `${n.repo.packageCommand} install -y ${coreServices.map(s=>s.name).join(' ')} ${installOptions}`;
            return n.executeShellCommand(command);
        });
        var result = $.promiseFactory.newGroupPromise(commandPromises);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I prepare each node with the patch repo configuration$/, function () {
        var nodePromises = $.clusterUnderTest.nodes().map(n=>{
            var isYum = n.repo.type=='yum';
            var destinationPath = isYum ? '/etc/yum.repos.d/' : '/etc/apt/sources.list.d/';
            var repoFileName = isYum ? 'mapr-patch-yum.repo' : 'mapr-patch-apt-get.list';

            return n.executeCopyCommand(`data/testing-resources/${repoFileName}`, `${destinationPath}${repoFileName}`);
        });
        var result = $.promiseFactory.newGroupPromise(nodePromises);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.When(/^I install the latest patch$/, { timeout: 1000 * 60 * 20 }, function () {
        var commandPromises = $.clusterUnderTest.nodes().map(n => {
            var installOptions = n.repo.type=='apt-get' ? '--allow-unauthenticated' : '';
            var command = `${n.repo.packageCommand} install -y mapr-patch ${installOptions}`;
            return n.executeShellCommand(command);
        });
        var result = $.promiseFactory.newGroupPromise(commandPromises);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I install all spyglass components$/, { timeout: 1000 * 60 * 20 }, function () {
        var commandPromises = $.clusterUnderTest.nodes().map(n=>{
            var spyglassServices = $.versioning.serviceSet().filter(s=>n.isHostingService(s.name) && !s.isCore);
            var installOptions = n.repo.type=='apt-get' ? '--allow-unauthenticated' : '';
            var command = `${n.repo.packageCommand} install -y ${spyglassServices.map(s=>s.name).join(' ')} ${installOptions}`;
            return n.executeShellCommand(command);
        });
        var result = $.promiseFactory.newGroupPromise(commandPromises);
        return $.expect(result).to.eventually.be.fulfilled;
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
        var nodePromises = $.clusterUnderTest.nodes().map(n=>{
            var isYum = n.repo.type=='yum';
            var destinationPath = isYum ? '/etc/yum.repos.d/' : '/etc/apt/sources.list.d/';

            var repoFileName = isYum ? 'mapr-yum.repo' : 'mapr-apt-get.list';
            var ecosystemFileName = isYum ? 'ecosystem-yum.repo' : 'ecosystem-apt-get.list';

            return $.promiseFactory.newGroupPromiseFromArray([
                n.executeCopyCommand(`data/testing-resources/${repoFileName}`, `${destinationPath}${repoFileName}`),
                n.executeCopyCommand(`data/testing-resources/${ecosystemFileName}`, `${destinationPath}${ecosystemFileName}`)
            ]);
        });
        var everythingPromise = $.promiseFactory.newGroupPromise(nodePromises);
        return $.expect(everythingPromise).to.eventually.be.fulfilled;
    });

    this.Given(/^I prepare the disk\.list file$/, function () {
        var diskCommand = `sfdisk -l | grep "/dev/sd[a-z]" |grep -v "/dev/sd[a-z][0-9]" | sort |cut -f2 -d' ' | tr ":" " " | awk '{if(NR>1)print}' > /root/disk.list`;
        var result = $.clusterUnderTest.executeShellCommandOnEachNode(diskCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I run configure\.sh on all nodes$/, function () {
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

    this.Given(/^I have installed Java$/, { timeout: 1000 * 60 * 7 }, function () {
        var nodePromises = $.clusterUnderTest.nodes().map(n=> {
            var isYum = n.repo.type == 'yum';
            return n.executeShellCommand(isYum ? 'yum install -y java' : 'apt-get install -y openjdk-7-jre openjdk-7-jdk');
        });
        return $.expect($.promiseFactory.newGroupPromise(nodePromises)).to.eventually.be.fulfilled;
    });

    this.Given(/^the cluster has MapR Installed$/, function () {
        // var commandPromises =  $.clusterUnderTest.nodes().map(n=>{ return n.verifyMapRIsInstalled()});
        // var result = $.promiseFactory.newGroupPromise(commandPromises);
        var result = $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes().map(n => n.verifyMapRIsInstalled()));
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I remove all spyglass components$/, function () {
        var commandPromises = $.clusterUnderTest.nodes().map(n=>{
            var spyglassServices = $.versioning.serviceSet().filter(s=>n.isHostingService(s.name) && !s.isCore);
            var removeOption =  n.repo.type=='apt-get' ? `purge -y` : `remove -y`;
            var command = `${n.repo.packageCommand} ${removeOption} ${spyglassServices.map(s=>s.name).join(' ')}`;
            return n.executeShellCommand(command);
        });
        var result = $.promiseFactory.newGroupPromise(commandPromises);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I remove all the core components$/, function () {
        var commandPromises = $.clusterUnderTest.nodes().map(n=>{
            var command = n.repo.type=='apt-get'
                ? `dpkg -l | grep mapr | cut -d ' ' -f 3 | sed ':a;N;$!ba;s/\\n/ /g' | xargs -i apt-get purge {} -y`
                :`rpm -qa | grep mapr | sed ":a;N;$!ba;s/\\n/ /g" | xargs rpm -e`;
            return n.executeShellCommand(command);
        });
        var result = $.promiseFactory.newGroupPromise(commandPromises);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I clear all mapr data$/, function () {
        var cmdPromises = $.clusterUnderTest.nodes().map( n => {
            var cmdList = $.collections.newEmptyList<string>();
            cmdList.push('rm -rfv /tmp/hadoop*');
            cmdList.push(`rm -rfv /opt/mapr`)
            cmdList.push(`rm -rfv /opt/cores/*`)
            cmdList.push(`rm -rf /var/mapr-zookeeper-data`)
            return n.executeShellCommands(cmdList);
        });
        var result = $.promiseFactory.newGroupPromise(cmdPromises);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I stop all zookeeper services$/, function () {
        var commandPromises = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=> {
            return n.executeShellCommand(`service mapr-zookeeper stop`);
        });
        var result = $.promiseFactory.newGroupPromise(commandPromises);
        return $.expect(result).to.eventually.be.fulfilled;
    });

}

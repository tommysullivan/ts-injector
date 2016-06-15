import { binding as steps, given, when, then } from "cucumber-tsflow";
import Framework from "../../lib/framework/framework";
import PromisedAssertion = Chai.PromisedAssertion;
import IPackage from "../../lib/packaging/i-package";
import INodeUnderTest from "../../lib/cluster-testing/i-node-under-test";
declare var $:Framework;
declare var module:any;

@steps()
export default class PackageManagerInstallationSteps {

    private firstNonCldb:INodeUnderTest;

    @given(/^I have updated the package manager$/)
    updatePackageManagerOnAllNodes():PromisedAssertion {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>n.executeShellCommand(n.packageManager.packageUpdateCommand))
        ).to.eventually.be.fulfilled;
    }

    @when(/^I install the latest patch, respecting the current variant, on all nodes list it as a dependency$/)
    installLatestPatchWithRespectToVariant():PromisedAssertion {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n => {
                var command = n.packageManager.installPackageCommand('mapr-patch');
                return n.executeShellCommand(command);
            })
        ).to.eventually.be.fulfilled;
    }

    @when(/^I install packages with the "([^"]*)" tag$/)
    installPackagesWithTag(tagName:string):PromisedAssertion {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>{
                var taggedPackages = n.packages.where(p=>p.tags.contain(tagName));
                var nodeRepoConfigWrites = taggedPackages.map((p:IPackage)=>{
                    var repo = $.packaging.defaultRepositories.repositoryHosting(p.name, p.version.toString(), p.promotionLevel.name, n.operatingSystem.name);
                    var repoConfigContent = n.packageManager.clientConfigurationFileContentFor(repo, `repo-for-${p.name}`, p.tags.first());
                    var repoConfigLocation = n.packageManager.clientConfigurationFileLocationFor(p.name);
                    return n.write(repoConfigContent, repoConfigLocation);
                });
                return $.promiseFactory.newGroupPromise(nodeRepoConfigWrites)
                    .then(_=>n.executeShellCommands($.collections.newList([
                        n.packageManager.packageUpdateCommand,
                        taggedPackages.notEmpty() ? n.packageManager.installPackagesCommand(taggedPackages.map(p=>p.name)) : '#no packages to install'
                    ])));
            })
        ).to.eventually.be.fulfilled;
    }

    @given(/^I prepare the disk\.list file$/)
    prepareDiskListFile() {
        var diskCommand = `sfdisk -l | grep "/dev/sd[a-z]" |grep -v "/dev/sd[a-z][0-9]" | sort |cut -f2 -d' ' | tr ":" " " | awk '{if(NR>1)print}' > /root/disk.list`;
        var result = $.clusterUnderTest.executeShellCommandOnEachNode(diskCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I run configure\.sh on all nodes$/)
    runConfigureOnAllNodes():PromisedAssertion {
        var cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(n=>n.host).join(',');
        var zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=>n.host).join(',');
        var historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        var configCommand =`/opt/mapr/server/configure.sh -C ${cldbHostsString} -Z ${zookeeperHostsString} -HS ${historyHostString} -u mapr -g mapr -N ${$.clusterUnderTest.name} -F /root/disk.list`
        var result = $.clusterUnderTest.executeShellCommandOnEachNode(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I install the license on cluster$/)
    installLicenseOnCluster():PromisedAssertion {
        var downloadLicense = `wget http://maprqa:maprqa@stage.mapr.com/license/LatestDemoLicense-M7.txt`;
        var licenseCommand = `maprcli license add -license LatestDemoLicense-M7.txt -is_file true`;
        var removeLicenseCommand = `rm -f LatestDemoLicense-M7.txt`;
        var result = $.clusterUnderTest.nodes().first().executeShellCommands(
            $.collections.newList([downloadLicense, licenseCommand, removeLicenseCommand])
        );
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I run configure\.sh for spyglass components$/)
    runConfigureForSpyglassComponents():PromisedAssertion {
        var cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(n=>n.host).join(',');
        var zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=>n.host).join(',');
        var opentsdbHostsString = $.clusterUnderTest.nodesHosting('mapr-opentsdb').map(n=>n.host).join(',');
        var elasticsearchHostsString = $.clusterUnderTest.nodesHosting('mapr-elasticsearch').map(n=>n.host).join(',');
        var configCommand =`/opt/mapr/server/configure.sh -OT ${opentsdbHostsString} -ES ${elasticsearchHostsString} -R`;
        var result = $.clusterUnderTest.executeShellCommandOnEachNode(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I use the package manager to install the "([^"]*)" package$/)
    usePackageManagerToInstallSpecifiedPackage(packageName:string):PromisedAssertion {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(
                n=>n.executeShellCommand(n.packageManager.installPackageCommand(packageName))
            )
        ).to.eventually.be.fulfilled;
    }

    @given(/^I remove all non-core components$/)
    removeAllSpyglassComponents():PromisedAssertion {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>{
                var spyglassServices = n.packages.where(p=>!p.tags.contain('core'));
                var command = n.packageManager.uninstallPackagesCommand(spyglassServices.map(s=>s.name));
                return n.executeShellCommand(command);
            })
        ).to.eventually.be.fulfilled;
    }

    @given(/^I remove all the core components$/)
    removeAllCoreComponents():PromisedAssertion {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>n.executeShellCommand(n.packageManager.uninstallAllPackagesWithMapRInTheName))
        ).to.eventually.be.fulfilled;
    }

    @given(/^I clear all mapr data$/)
    clearAllMapRDataDirectories():PromisedAssertion {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n => {
                var cmdList = $.collections.newList<string>([
                    'rm -rfv /tmp/hadoop*',
                    `rm -rfv /opt/mapr`,
                    `rm -rfv /opt/cores/*`,
                    `rm -rf /var/mapr-zookeeper-data`
                ]);
                return n.executeShellCommands(cmdList);
            })
        ).to.eventually.be.fulfilled;
    }

    @given(/^I run configure\.sh on all nodes without \-F$/)
    runConfigureOnAllNodesWithoutDashFOption():PromisedAssertion {
        var cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(n=>n.host).join(',');
        var zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=>n.host).join(',');
        var historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        var configCommand =`/opt/mapr/server/configure.sh -C ${cldbHostsString} -Z ${zookeeperHostsString} -HS ${historyHostString} -u mapr -g mapr -N ${$.clusterUnderTest.name}`;
        var result = $.clusterUnderTest.executeShellCommandOnEachNode(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I set the mfs instance to "([^"]*)"$/)
    setMFSInstance(mfsInstances:string):PromisedAssertion {
        return $.expect(
            $.clusterUnderTest.nodes().first().executeShellCommand(`maprcli config save -values '{"multimfs.numinstances.pernode":"${mfsInstances}}'`)
        ).to.eventually.be.fulfilled;
    }

    @given(/^I perform the following ssh commands on each node in the cluster as user "([^"]*)" with password "([^"]*)":$/)
    performSSHCommandsAsUser(user:string, userPasswd:string, commands:string) {
        var commandList = $.collections.newList(commands.split("\n"));
        var nodeRequests = $.clusterUnderTest.nodes().map(n=>{
            return $.sshAPI.newSSHClient().connect(n.host, user, userPasswd)
                .then(session=>session.executeCommands(commandList))
        });
        return $.expectAll(nodeRequests).to.eventually.be.fulfilled;
    }

    @given(/^I add the user "([^"]*)" to secondary group "([^"]*)"$/)
    addUserToSecondaryGroup(user:string, secondaryGroup:string):PromisedAssertion {
        var userToGroupCommand = `usermod -G ${secondaryGroup} ${user}`;
        return $.expect(this.firstNonCldb.executeShellCommand(userToGroupCommand)).to.eventually.be.fulfilled;
    }

    @given(/^I install maven on a non\-cldb node$/)
   installMavenOnNonCLDBNode():PromisedAssertion {
        var getMvn =`wget http://www.carfab.com/apachesoftware/maven/maven-3/3.0.5/binaries/apache-maven-3.0.5-bin.tar.gz`;
        var untarMvn =`tar -zxf apache-maven-3.0.5-bin.tar.gz`;
        var copyMvn =`cp -R apache-maven-3.0.5 /usr/local`;
        var symLink =`ln -s /usr/local/apache-maven-3.0.5/bin/mvn /usr/bin/mvn`;
        var delMvn = `rm apache-maven-3.0.5-bin.tar.gz`;
        this.firstNonCldb = $.clusterUnderTest.nodes().filter(n => !n.isHostingService('mapr-cldb')).first();
        var resultList = this.firstNonCldb.executeShellCommands($.collections.newList([getMvn, untarMvn, copyMvn, symLink, delMvn]));
        return $.expect(resultList).to.eventually.be.fulfilled;
    }

    @given(/^I install git on the non\-cldb node$/)
    installGitOnNonCLDBNode():PromisedAssertion {
        var gitInstallCommand = this.firstNonCldb.packageManager.installPackageCommand('git');
        var result = this.firstNonCldb.executeShellCommand(gitInstallCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I copy the maven settings file to the non\-cldb node$/)
    copyMavenSettingsFileToNonCldbNode():PromisedAssertion {
        var result = this.firstNonCldb.executeShellCommand("mkdir -p /root/.m2")
            .then(r => this.firstNonCldb.upload('./data/ats-files/settings.xml', '/root/.m2/'));
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I clone ATS on the node from "([^"]*)"$/)
    cloneATSOnNodeFrom(atsPath:string):PromisedAssertion {
        var result = this.firstNonCldb.executeShellCommand(`git clone ${atsPath}`);
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I setup passwordless ssh from non\-cldb node to all other nodes$/)
    setupPasswordlessSSHFromCLDBNodeToOtherNodes():PromisedAssertion {
        var resultList = this.firstNonCldb.executeShellCommand(`echo -e  'y' | ssh-keygen -t rsa -P '' -f /root/.ssh/id_rsa`)
            .then(_ => this.firstNonCldb.executeShellCommand(`cat /root/.ssh/id_rsa.pub`))
            .then(result => {
                var rsaKey = result.processResult().stdoutLines().join('\n');
                return  $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes().map(node => node.executeShellCommand(`mkdir -p /root/.ssh`)
                    .then(_ => node.executeShellCommand(`echo "${rsaKey}" > /root/.ssh/authorized_keys`))));
            })
        return $.expect(resultList).to.eventually.be.fulfilled;
    }

    @given(/^I set StrictHostKeyChecking option to no on non\-cldb node$/)
    setStrictHostKeyCheckingToNoNonCLDBNode():PromisedAssertion {
        return $.expect(this.firstNonCldb.executeShellCommand('echo "StrictHostKeyChecking no" > /root/.ssh/config')).to.eventually.be.fulfilled;
    }

    @given(/^I set the git ssh key$/)
    setGitSSHKey():PromisedAssertion {
        var changePerm =`chmod 600 /root/.ssh/maprqa_id_rsa`;
        var addToConfig = `echo -e "StrictHostKeyChecking no\nhost github.com\nHostName github.com\nIdentityFile /root/.ssh/maprqa_id_rsa\nUser git" > /root/.ssh/config`;
        var results = this.firstNonCldb.upload(`./data/ats-files/maprqa_id_rsa`, '/root/.ssh/').then(_ => {
            return this.firstNonCldb.executeShellCommands($.collections.newList([changePerm, addToConfig]));
        });
        return $.expect(results).to.eventually.be.fulfilled;
    }

    @given(/^I remove the git ssh key$/)
    removeGitSSHKey():PromisedAssertion {
        var deleteKey = `rm -rf /root/.ssh/maprqa_id_rsa`;
        var deleteConfig = `rm -rf /root/.ssh/config`;
        var resultList = this.firstNonCldb.executeShellCommands($.collections.newList([deleteKey, deleteConfig]));
        return $.expect(resultList).to.eventually.be.fulfilled;
    }
}
module.exports = PackageManagerInstallationSteps;
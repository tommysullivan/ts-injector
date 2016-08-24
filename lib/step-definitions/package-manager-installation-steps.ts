import { binding as steps, given, when, then } from "cucumber-tsflow";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import Framework from "../framework/framework";
import INodeUnderTest from "../cluster-testing/i-node-under-test";
import IPackage from "../packaging/i-package";

declare const $:Framework;
declare const module:any;
declare const __dirname;

@steps()
export default class PackageManagerInstallationSteps {

    private atsInstallationNode:INodeUnderTest;

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
                const command = n.packageManager.installPackageCommand('mapr-patch');
                return n.executeShellCommand(command);
            })
        ).to.eventually.be.fulfilled;
    }

    @when(/^I install packages with the "([^"]*)" tag$/)
    installPackagesWithTag(tagName:string):PromisedAssertion {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>{
                const taggedPackages = n.packages.where(p=>p.tags.contain(tagName));
                const nodeRepoConfigWrites = taggedPackages.map((p:IPackage)=>{
                    const repo = $.packaging.defaultRepositories.repositoryHosting(p.name, p.version.toString(), p.promotionLevel.name, n.operatingSystem.name);
                    const repoConfigContent = n.packageManager.clientConfigurationFileContentFor(repo, `repo-for-${p.name}`, p.tags.first());
                    const repoConfigLocation = n.packageManager.clientConfigurationFileLocationFor(p.name);
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
        const diskCommand = `sfdisk -l | grep "/dev/sd[a-z]" |grep -v "/dev/sd[a-z][0-9]" | sort |cut -f2 -d' ' | tr ":" " " | awk '{if(NR>1)print}' > /root/disk.list`;
        const result = $.clusterUnderTest.executeShellCommandOnEachNode(diskCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I run configure\.sh on all nodes$/)
    runConfigureOnAllNodes():PromisedAssertion {
        const cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(n=>n.host).join(',');
        const zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=>n.host).join(',');
        const historyHostString:string = $.clusterUnderTest.nodesHosting(`mapr-historyserver`).isEmpty ? `` : `-HS ${$.clusterUnderTest.nodeHosting('mapr-historyserver').host}`; 
        const configCommand =`/opt/mapr/server/configure.sh -C ${cldbHostsString} -Z ${zookeeperHostsString} ${historyHostString} -u mapr -g mapr -N ${$.clusterUnderTest.name} -F /root/disk.list`;
        const result = $.clusterUnderTest.executeShellCommandOnEachNode(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I install the license on cluster$/)
    installLicenseOnCluster():PromisedAssertion {
        const downloadLicense = `wget http://maprqa:maprqa@stage.mapr.com/license/LatestDemoLicense-M7.txt`;
        const licenseCommand = `maprcli license add -license LatestDemoLicense-M7.txt -is_file true`;
        const removeLicenseCommand = `rm -f LatestDemoLicense-M7.txt`;
        const result = $.clusterUnderTest.nodes().first().executeShellCommands(
            $.collections.newList([downloadLicense, licenseCommand, removeLicenseCommand])
        );
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I run configure\.sh for spyglass components$/)
    runConfigureForSpyglassComponents():PromisedAssertion {
        const opentsdbHostsString:string = $.clusterUnderTest.nodesHosting(`mapr-opentsdb`).isEmpty ? `` : `-OT ${$.clusterUnderTest.nodesHosting('mapr-opentsdb').map(n=>n.host).join(',')}`;
        const elasticsearchHostsString:string = $.clusterUnderTest.nodesHosting(`mapr-elasticsearch`).isEmpty ? `` : `-ES ${$.clusterUnderTest.nodesHosting('mapr-elasticsearch').map(n=>n.host).join(',')}`;
        const configCommand =`/opt/mapr/server/configure.sh ${opentsdbHostsString} ${elasticsearchHostsString} -R`;
        const result = $.clusterUnderTest.executeShellCommandOnEachNode(configCommand);
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
                const spyglassServices = n.packages.where(p=>!p.tags.contain('core'));
                if(spyglassServices.length > 0) {
                    const command = n.packageManager.uninstallPackagesCommand(spyglassServices.map(s=>s.name));
                    return n.executeShellCommand(command);
                }
                else
                    return;
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
                const cmdList = $.collections.newList<string>([
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
        const cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(n=>n.host).join(',');
        const zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=>n.host).join(',');
        const historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        const configCommand =`/opt/mapr/server/configure.sh -C ${cldbHostsString} -Z ${zookeeperHostsString} -HS ${historyHostString} -u mapr -g mapr -N ${$.clusterUnderTest.name}`;
        const result = $.clusterUnderTest.executeShellCommandOnEachNode(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I set the mfs instance to "([^"]*)"$/)
    setMFSInstance(mfsInstances:string):PromisedAssertion {
        return $.expect(
            $.clusterUnderTest.nodes().first().executeShellCommand(`maprcli config save -values '{"multimfs.numinstances.pernode":"${mfsInstances}}'`)
        ).to.eventually.be.fulfilled;
    }

    @given(/^I add the user "([^"]*)" to secondary group "([^"]*)"$/)
    addUserToSecondaryGroup(user:string, secondaryGroup:string):PromisedAssertion {
        const userToGroupCommand = `usermod -G ${secondaryGroup} ${user}`;
        return $.expect(this.atsInstallationNode.executeShellCommand(userToGroupCommand)).to.eventually.be.fulfilled;
    }

    @given(/^I install maven on a non\-cldb node$/)
   installMavenOnNonCLDBNode():PromisedAssertion {
        const getMvn =`wget https://archive.apache.org/dist/maven/maven-3/3.0.5/binaries/apache-maven-3.0.5-bin.tar.gz`;
        const untarMvn =`tar -zxf apache-maven-3.0.5-bin.tar.gz`;
        const copyMvn =`cp -R apache-maven-3.0.5 /usr/local`;
        const symLink =`ln -s /usr/local/apache-maven-3.0.5/bin/mvn /usr/bin/mvn`;
        const delMvn = `rm apache-maven-3.0.5-bin.tar.gz`;
        const nodes = $.clusterUnderTest.nodes();
        const withoutCLDB = n=>!n.isHostingService('mapr-cldb');
        this.atsInstallationNode = nodes.hasAtLeastOne(withoutCLDB)
            ? nodes.firstWhere(withoutCLDB)
            : nodes.first();
        const result = this.atsInstallationNode.executeShellCommand(`mvn -v`).catch(e =>
            (this.atsInstallationNode.executeShellCommands($.collections.newList([getMvn, untarMvn, copyMvn, symLink, delMvn])))
        );
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I install git on the non\-cldb node$/)
    installGitOnNonCLDBNode():PromisedAssertion {
        const gitInstallCommand = this.atsInstallationNode.packageManager.installPackageCommand('git');
        const result = this.atsInstallationNode.executeShellCommand(gitInstallCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I copy the maven settings file to the non\-cldb node$/)
    copyMavenSettingsFileToNonCldbNode():PromisedAssertion {
        const settingsPath:string = __dirname + '/../../ats-files/settings.xml';
        const result = this.atsInstallationNode.executeShellCommand("mkdir -p /root/.m2")
            .then(r => this.atsInstallationNode.upload(settingsPath, '/root/.m2/'));
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I clone ATS on the node from "([^"]*)"$/)
    cloneATSOnNodeFrom(atsPath:string):PromisedAssertion {
        const result = this.atsInstallationNode.executeShellCommand(`git clone ${atsPath}`);
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @given(/^I setup passwordless ssh from non\-cldb node to all other nodes$/)
    setupPasswordlessSSHFromCLDBNodeToOtherNodes():PromisedAssertion {
        const resultList = this.atsInstallationNode.executeShellCommand(`echo -e  'y' | ssh-keygen -t rsa -P '' -f /root/.ssh/id_rsa`)
            .then(_ => this.atsInstallationNode.executeShellCommand(`cat /root/.ssh/id_rsa.pub`))
            .then(result => {
                const rsaKey = result.processResult().stdoutLines().join('\n');
                return  $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes().map(node => node.executeShellCommand(`mkdir -p /root/.ssh`)
                    .then(_ => node.executeShellCommand(`echo "${rsaKey}" > /root/.ssh/authorized_keys`))));
            })
        return $.expect(resultList).to.eventually.be.fulfilled;
    }

    @given(/^I set StrictHostKeyChecking option to no on non\-cldb node$/)
    setStrictHostKeyCheckingToNoNonCLDBNode():PromisedAssertion {
        return $.expect(this.atsInstallationNode.executeShellCommand('echo "StrictHostKeyChecking no" > /root/.ssh/config')).to.eventually.be.fulfilled;
    }

    @given(/^I set the git ssh key$/)
    setGitSSHKey():PromisedAssertion {
        const createSSHDirCmd = 'mkdir -p /root/.ssh';
        const idRSAPath:string = __dirname + '/../../ats-files/maprqa_id_rsa';
        const changePerm =`chmod 600 /root/.ssh/maprqa_id_rsa`;
        const addToConfig = `echo -e "StrictHostKeyChecking no\nhost github.com\nHostName github.com\nIdentityFile /root/.ssh/maprqa_id_rsa\nUser git" > /root/.ssh/config`;
        const results = this.atsInstallationNode.executeShellCommand(createSSHDirCmd).then(_ => this.atsInstallationNode.upload(idRSAPath, '/root/.ssh/').then(_ => {
            this.atsInstallationNode.executeShellCommands($.collections.newList([changePerm, addToConfig]));
        }));
        return $.expect(results).to.eventually.be.fulfilled;
    }

    @given(/^I remove the git ssh key$/)
    removeGitSSHKey():PromisedAssertion {
        const deleteKey = `rm -rf /root/.ssh/maprqa_id_rsa`;
        const deleteConfig = `rm -rf /root/.ssh/config`;
        const resultList = this.atsInstallationNode.executeShellCommands($.collections.newList([deleteKey, deleteConfig]));
        return $.expect(resultList).to.eventually.be.fulfilled;
    }
}
module.exports = PackageManagerInstallationSteps;
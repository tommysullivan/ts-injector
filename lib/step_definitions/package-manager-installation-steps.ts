import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {INode} from "../clusters/i-node";
import {IPackage} from "../packaging/i-package";
import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {IList} from "../collections/i-list";
import {ISSHResult} from "../ssh/i-ssh-result";
import {IFuture} from "../futures/i-future";

declare const $:ICucumberStepHelper;
declare const module:any;
declare const __dirname;

module.exports = function() {

    let atsInstallationNode:INode;

    this.Before(function () {
        atsInstallationNode = undefined;
    });

    this.Given(/^I have updated the package manager$/, ():PromisedAssertion  => {
        return $.expectAll(
            $.clusterUnderTest.nodes.map(n=>n.executeShellCommand(n.packageManager.packageUpdateCommand))
        ).to.eventually.be.fulfilled;
    });

    this.When(/^I install the latest patch, respecting the current variant, on all nodes list it as a dependency$/, ():PromisedAssertion => {
        return $.expectAll(
            $.clusterUnderTest.nodes.map(n => {
                const command = n.packageManager.installPackageCommand('mapr-patch');
                return n.executeShellCommand(command);
            })
        ).to.eventually.be.fulfilled;
    });

    function repositoriesContainingTaggedPackages(nodes:IList<INode>, tagName:string, releaseName:string, functionThatYieldsCommandToRun:(node:INode, packageNames:IList<string>)=>string):IList<IFuture<IList<ISSHResult>>> {
        return nodes.map(node=>{
            const taggedPackages = node.packages.where(p=>p.tags.contain(tagName));
            const uniqueRepos = taggedPackages.map((p:IPackage)=>
                $.packaging.defaultRepositories.repositoryHosting(
                    p.name,
                    p.version.toString(),
                    p.promotionLevel.name,
                    node.operatingSystem.name,
                    releaseName
                )
            ).unique;

            return uniqueRepos
                .mapToFutureList(repo => {
                    const repoConfigContent = node.packageManager.clientConfigurationFileContentFor(repo, `repo-for-${tagName}`);
                    const repoConfigLocation = node.packageManager.clientConfigurationFileLocationFor(tagName);
                    return node.write(repoConfigContent, repoConfigLocation);
                })
                .then(_=> taggedPackages.notEmpty
                    ? node.executeShellCommands(
                        node.packageManager.packageUpdateCommand,
                        functionThatYieldsCommandToRun(node, taggedPackages.map(p=>p.name))
                    )
                    : $.futures.newFutureForImmediateValue($.collections.newEmptyList<ISSHResult>())
                );
        })
    }

    this.When(/^I install packages with the "([^"]*)" tag$/, (tagName:string):PromisedAssertion  => {
        return $.expectAll(
            repositoriesContainingTaggedPackages(
                $.clusterUnderTest.nodes,
                tagName,
                $.testing.defaultRelease.name,
                (node, packageNames) => node.packageManager.installPackagesCommand(packageNames)
            )
        ).to.eventually.be.fulfilled;
    });

    this.Then(/^I update packages with the "([^"]*)" tag to release version "([^"]*)"$/, (tagName:string, releaseName:string):PromisedAssertion => {
        return $.expectAll(
            repositoriesContainingTaggedPackages(
                $.clusters.newCluster(
                    $.clusters.clusterConfigurationWithId($.clusterId),
                    $.releasing.defaultReleases.releaseNamed(releaseName).phaseNamed($.testing.defaultPhaseName)
                ).nodes,
                tagName,
                releaseName,
                (node, packageNames) => node.packageManager.updatePackagesCommand(packageNames)
            )
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I prepare the disk\.list file$/, (): PromisedAssertion => {
        const diskCheckCmd = `sfdisk -l`;
        const diskListCommand = `sfdisk -l | grep "/dev/sd[a-z]" |grep -v "/dev/sd[a-z][0-9]" | sort |cut -f2 -d' ' | tr ":" " "`;
        const dockerVolumeLocalPath = $.docker.newMesosEnvironmentFromConfig($.clusterId.split(`:`)[0]).dockerVolumeLocalPath;
        const listDockerDisks = `ls ${dockerVolumeLocalPath}`;
        if($.clusters.allIds.contain($.clusterId)) {
            const diskListResult = $.clusterUnderTest.nodes.map(n =>
                n.executeShellCommand(diskListCommand)
                    .then(result => {
                        const diskList = result.processResult.stdoutLines;
                        return diskList.mapToFutureList(d =>
                            $.futures.newDelayedFuture(2000)
                                .then(_ => n
                                        .executeShellCommand(`${diskCheckCmd} ${d} | wc -l`)
                                        .then(r => r.processResult.stdoutLines.first == '2' ? d : null)
                                )
                        );
                    })
                    .then(r => n.write(r.filter(i => i != null).join('\n'), '/root/disk.list'))
            );
            return $.expectAll(diskListResult).to.eventually.be.fulfilled;
        }
        else {
            const diskListResult = $.clusterUnderTest.nodes.map(n => n.executeShellCommand(listDockerDisks)
                .then(result => result.processResult.stdoutLines)
                .then(outLine => {
                    const resultDisks = outLine.map(line => `${dockerVolumeLocalPath}/${line}`);
                    return n.write(resultDisks.join(`\n`), '/root/disk.list')
                })
            );
            return $.expectAll(diskListResult).to.eventually.be.fulfilled;
        }
    });

    this.Given(/^I run configure\.sh on all nodes$/, ():PromisedAssertion => {
        const cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(n=>n.host).join(',');
        const zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=>n.host).join(',');
        const historyHostString:string = $.clusterUnderTest.nodesHosting(`mapr-historyserver`).isEmpty ? `` : `-HS ${$.clusterUnderTest.nodeHosting('mapr-historyserver').host}`;
        const configCommand =`/opt/mapr/server/configure.sh -C ${cldbHostsString} -Z ${zookeeperHostsString} ${historyHostString} -u mapr -g mapr -N ${$.clusterUnderTest.name} `;
        if($.clusters.allIds.contain($.clusterId)) {
            const result = $.clusterUnderTest.executeShellCommandOnEachNode(`${configCommand} -F /root/disk.list`);
            return $.expect(result).to.eventually.be.fulfilled;
        }
        else {
            const result = $.clusterUnderTest.nodes.mapToFutureList(node =>
                node.executeShellCommand(`cat /root/disk.list`)
                    .then(sshResult => node.executeShellCommand(`${configCommand} -D ${sshResult.processResult.stdoutLines.first}`))
            );
            return $.expect(result).to.eventually.be.fulfilled;
        }
    });

    this.Given(/^I install the license on cluster$/, ():PromisedAssertion => {
        const downloadLicense = `wget http://maprqa:maprqa@stage.mapr.com/license/LatestDemoLicense-M7.txt`;
        const licenseCommand = `maprcli license add -license LatestDemoLicense-M7.txt -is_file true`;
        const removeLicenseCommand = `rm -f LatestDemoLicense-M7.txt`;
        const result = $.clusterUnderTest.nodes.first.executeShellCommands(
            downloadLicense,
            licenseCommand,
            removeLicenseCommand
        );
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I run configure\.sh for spyglass components$/, ():PromisedAssertion => {
        const opentsdbHostsString:string = $.clusterUnderTest.nodesHosting(`mapr-opentsdb`).isEmpty ? `` : `-OT ${$.clusterUnderTest.nodesHosting('mapr-opentsdb').map(n=>n.host).join(',')}`;
        const elasticsearchHostsString:string = $.clusterUnderTest.nodesHosting(`mapr-elasticsearch`).isEmpty ? `` : `-ES ${$.clusterUnderTest.nodesHosting('mapr-elasticsearch').map(n=>n.host).join(',')}`;
        const configCommand =`/opt/mapr/server/configure.sh ${opentsdbHostsString} ${elasticsearchHostsString} -R`;
        const result = $.clusterUnderTest.executeShellCommandOnEachNode(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I use the package manager to install the "([^"]*)" package$/, (packageName:string):PromisedAssertion  => {
        return $.expectAll(
            $.clusterUnderTest.nodes.map(
                n=>n.executeShellCommand(n.packageManager.installPackageCommand(packageName))
            )
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I remove all non-core components$/, ():PromisedAssertion => {
        return $.expectAll(
            $.clusterUnderTest.nodes.map(n=>{
                const spyglassServices = n.packages.where(p=>!p.tags.contain('core'));
                if(spyglassServices.length > 0) {
                    const command = n.packageManager.uninstallPackagesCommand(spyglassServices.map(s=>s.name));
                    return n.executeShellCommand(command);
                }
                else
                    return;
            })
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I remove all the core components$/, ():PromisedAssertion  => {
        const result = $.clusterUnderTest.nodes.map(n=> {
                const checkPackagesCommand:string = `${n.packageManager.packageListCommand} | grep mapr`;
                return n.executeShellCommands(checkPackagesCommand, n.packageManager.uninstallAllPackagesWithMapRInTheName)
                    .catch(e => console.log(`No packages to Uninstall or some packages failed to get removed`));
        });
        return $.expectAll(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I clear all mapr data$/, ():PromisedAssertion => {
        return $.expectAll(
            $.clusterUnderTest.nodes.map(n => {
                return n.executeShellCommands(
                    'rm -rfv /tmp/hadoop*',
                    `rm -rfv /opt/mapr`,
                    `rm -rfv /opt/cores/*`,
                    `rm -rf /var/mapr-zookeeper-data`
                );
            })
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I run configure\.sh on all nodes without \-F$/, ():PromisedAssertion => {
        const cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(n=>n.host).join(',');
        const zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(n=>n.host).join(',');
        const historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        const configCommand =`/opt/mapr/server/configure.sh -C ${cldbHostsString} -Z ${zookeeperHostsString} -HS ${historyHostString} -u mapr -g mapr -N ${$.clusterUnderTest.name}`;
        const result = $.clusterUnderTest.executeShellCommandOnEachNode(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I set the mfs instance to "([^"]*)"$/, (mfsInstances:string):PromisedAssertion  => {
        return $.expect(
            $.clusterUnderTest.nodes.first.executeShellCommand(`maprcli config save -values '{"multimfs.numinstances.pernode":"${mfsInstances}}'`)
        ).to.eventually.be.fulfilled;
    });

    this.Given(/^I add the user "([^"]*)" to secondary group "([^"]*)"$/, (user:string, secondaryGroup:string):PromisedAssertion => {
        const userToGroupCommand = `usermod -G ${secondaryGroup} ${user}`;
        return $.expect(atsInstallationNode.executeShellCommand(userToGroupCommand)).to.eventually.be.fulfilled;
    });

    this.Given(/^I install maven on a non\-cldb node$/, ():PromisedAssertion => {
        const getMvn =`wget https://archive.apache.org/dist/maven/maven-3/3.0.5/binaries/apache-maven-3.0.5-bin.tar.gz`;
        const untarMvn =`tar -zxf apache-maven-3.0.5-bin.tar.gz`;
        const copyMvn =`cp -R apache-maven-3.0.5 /usr/local`;
        const symLink =`ln -s /usr/local/apache-maven-3.0.5/bin/mvn /usr/bin/mvn`;
        const delMvn = `rm apache-maven-3.0.5-bin.tar.gz`;
        const nodes = $.clusterUnderTest.nodes;
        const withoutCLDB = n=>!n.isHostingService('mapr-cldb');
        atsInstallationNode = nodes.hasAtLeastOne(withoutCLDB)
            ? nodes.firstWhere(withoutCLDB)
            : nodes.first;
        const result = atsInstallationNode.executeShellCommands(`mvn -v`).catch(e =>
            (atsInstallationNode.executeShellCommands(
                getMvn,
                untarMvn,
                copyMvn,
                symLink,
                delMvn
            ))
        );
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I install git on the non\-cldb node$/, () => {
        const gitInstallCommand = atsInstallationNode.packageManager.installPackageCommand('git');
        const result = atsInstallationNode.executeShellCommand(gitInstallCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I copy the maven settings file to the non\-cldb node$/, () => {
        const settingsPath:string = __dirname + '/../../ats-files/settings.xml';
        const result = atsInstallationNode.executeShellCommand("mkdir -p /root/.m2")
            .then(r => atsInstallationNode.upload(settingsPath, '/root/.m2/'));
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I clone ATS on the node from "([^"]*)"$/, (atsPath:string):PromisedAssertion => {
        const result = atsInstallationNode.executeShellCommand(`git clone ${atsPath}`);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I setup passwordless ssh from non\-cldb node to all other nodes$/, ():PromisedAssertion => {
        const resultList = atsInstallationNode.executeShellCommand(`echo -e  'y' | ssh-keygen -t rsa -P '' -f /root/.ssh/id_rsa`)
            .then(_ => atsInstallationNode.executeShellCommand(`cat /root/.ssh/id_rsa.pub`))
            .then(result => {
                const rsaKey = result.processResult.stdoutLines.join('\n');
                return $.clusterUnderTest.nodes.mapToFutureList(node => node.executeShellCommand(`mkdir -p /root/.ssh`)
                    .then(_ => node.executeShellCommand(`echo "${rsaKey}" > /root/.ssh/authorized_keys`)));
            });
        return $.expect(resultList).to.eventually.be.fulfilled;
    });

    this.Given(/^I set StrictHostKeyChecking option to no on non\-cldb node$/, ():PromisedAssertion => {
        return $.expect(atsInstallationNode.executeShellCommand('echo "StrictHostKeyChecking no" > /root/.ssh/config')).to.eventually.be.fulfilled;
    });

    this.Given(/^I set the git ssh key$/, ():PromisedAssertion  => {
        const createSSHDirCmd = 'mkdir -p /root/.ssh';
        const idRSAPath:string = __dirname + '/../../ats-files/maprqa_id_rsa';
        const changePerm =`chmod 600 /root/.ssh/maprqa_id_rsa`;
        const addToConfig = `echo -e "StrictHostKeyChecking no\nhost github.com\nHostName github.com\nIdentityFile /root/.ssh/maprqa_id_rsa\nUser git" > /root/.ssh/config`;
        const results = atsInstallationNode.executeShellCommand(createSSHDirCmd)
            .then(_ => atsInstallationNode.upload(idRSAPath, '/root/.ssh/'))
            .then(_ => atsInstallationNode.executeShellCommands(
                changePerm,
                addToConfig
            ));
        return $.expect(results).to.eventually.be.fulfilled;
    });

    this.Given(/^I remove the git ssh key$/, () => {
        const deleteKey = `rm -rf /root/.ssh/maprqa_id_rsa`;
        const deleteConfig = `rm -rf /root/.ssh/config`;
        const resultList = atsInstallationNode.executeShellCommands(
            deleteKey,
            deleteConfig
        );
        return $.expect(resultList).to.eventually.be.fulfilled;
    });

    this.Given(/^I query all the installed packages for the "([^"]*)" metadata$/, (metaData:string):PromisedAssertion => {
        const result = $.clusterUnderTest.nodes.mapToFutureList(node => {
            const commandList = node.expectedServiceNames.map(serviceName => `${node.packageManager.queryMetadataCommand} ${serviceName} | grep ${metaData}`);
            return node.executeShellCommands(...commandList.toArray())
        });
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I query all the installed packages on "([^"]*)" for the "([^"]*)" metadata$/, (osName:string, metaData:string):PromisedAssertion => {
        if(osName == $.clusterUnderTest.nodes.first.operatingSystem.name) {
            const result = $.clusterUnderTest.nodes.mapToFutureList(node => {
                const commandList = node.expectedServiceNames.map(serviceName => `${node.packageManager.queryMetadataCommand} ${serviceName} | grep ${metaData}`);
                return node.executeShellCommands(...commandList.toArray())
            });
            return $.expect(result).to.eventually.be.fulfilled;
        }
    });
};
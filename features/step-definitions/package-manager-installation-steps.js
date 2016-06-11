"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var PackageManagerInstallationSteps = (function () {
    function PackageManagerInstallationSteps() {
    }
    PackageManagerInstallationSteps.prototype.updatePackageManagerOnAllNodes = function () {
        return $.expectAll($.clusterUnderTest.nodes().map(function (n) { return n.executeShellCommand(n.packageManager.packageUpdateCommand); })).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.installLatestPatchWithRespectToVariant = function () {
        return $.expectAll($.clusterUnderTest.nodes().map(function (n) {
            var command = n.packageManager.installPackageCommand('mapr-patch');
            return n.executeShellCommand(command);
        })).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.installPackagesWithTag = function (tagName) {
        return $.expectAll($.clusterUnderTest.nodes().map(function (n) {
            var taggedPackages = n.packages.where(function (p) { return p.tags.contain(tagName); });
            var nodeRepoConfigWrites = taggedPackages.map(function (p) {
                var repo = $.packaging.defaultRepositories.repositoryHosting(p.name, p.version.toString(), p.promotionLevel.name, n.operatingSystem.name);
                var repoConfigContent = n.packageManager.clientConfigurationFileContentFor(repo, "repo-for-" + p.name);
                var repoConfigLocation = n.packageManager.clientConfigurationFileLocationFor(p.name);
                return n.write(repoConfigContent, repoConfigLocation);
            });
            return $.promiseFactory.newGroupPromise(nodeRepoConfigWrites)
                .then(function (_) { return n.executeShellCommands($.collections.newList([
                n.packageManager.packageUpdateCommand,
                taggedPackages.notEmpty() ? n.packageManager.installPackagesCommand(taggedPackages.map(function (p) { return p.name; })) : '#no packages to install'
            ])); });
        })).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.prepareDiskListFile = function () {
        var diskCommand = "sfdisk -l | grep \"/dev/sd[a-z]\" |grep -v \"/dev/sd[a-z][0-9]\" | sort |cut -f2 -d' ' | tr \":\" \" \" | awk '{if(NR>1)print}' > /root/disk.list";
        var result = $.clusterUnderTest.executeShellCommandOnEachNode(diskCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.runConfigureOnAllNodes = function () {
        var cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(function (n) { return n.host; }).join(',');
        var zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(function (n) { return n.host; }).join(',');
        var historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        var configCommand = "/opt/mapr/server/configure.sh -C " + cldbHostsString + " -Z " + zookeeperHostsString + " -HS " + historyHostString + " -u mapr -g mapr -N " + $.clusterUnderTest.name + " -F /root/disk.list";
        var result = $.clusterUnderTest.executeShellCommandOnEachNode(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.installLicenseOnCluster = function () {
        var downloadLicense = "wget http://maprqa:maprqa@stage.mapr.com/license/LatestDemoLicense-M7.txt";
        var licenseCommand = "maprcli license add -license LatestDemoLicense-M7.txt -is_file true";
        var removeLicenseCommand = "rm -f LatestDemoLicense-M7.txt";
        var result = $.clusterUnderTest.nodes().first().executeShellCommands($.collections.newList([downloadLicense, licenseCommand, removeLicenseCommand]));
        return $.expect(result).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.runConfigureForSpyglassComponents = function () {
        var cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(function (n) { return n.host; }).join(',');
        var zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(function (n) { return n.host; }).join(',');
        var opentsdbHostsString = $.clusterUnderTest.nodesHosting('mapr-opentsdb').map(function (n) { return n.host; }).join(',');
        var elasticsearchHostsString = $.clusterUnderTest.nodesHosting('mapr-elasticsearch').map(function (n) { return n.host; }).join(',');
        var configCommand = "/opt/mapr/server/configure.sh -OT " + opentsdbHostsString + " -ES " + elasticsearchHostsString + " -R";
        var result = $.clusterUnderTest.executeShellCommandOnEachNode(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.usePackageManagerToInstallSpecifiedPackage = function (packageName) {
        return $.expectAll($.clusterUnderTest.nodes().map(function (n) { return n.executeShellCommand(n.packageManager.installPackageCommand(packageName)); })).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.removeAllSpyglassComponents = function () {
        return $.expectAll($.clusterUnderTest.nodes().map(function (n) {
            var spyglassServices = n.packages.where(function (p) { return !p.tags.contain('core'); });
            var command = n.packageManager.uninstallPackagesCommand(spyglassServices.map(function (s) { return s.name; }));
            return n.executeShellCommand(command);
        })).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.removeAllCoreComponents = function () {
        return $.expectAll($.clusterUnderTest.nodes().map(function (n) { return n.executeShellCommand(n.packageManager.uninstallAllPackagesWithMapRInTheName); })).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.clearAllMapRDataDirectories = function () {
        return $.expectAll($.clusterUnderTest.nodes().map(function (n) {
            var cmdList = $.collections.newList([
                'rm -rfv /tmp/hadoop*',
                "rm -rfv /opt/mapr",
                "rm -rfv /opt/cores/*",
                "rm -rf /var/mapr-zookeeper-data"
            ]);
            return n.executeShellCommands(cmdList);
        })).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.runConfigureOnAllNodesWithoutDashFOption = function () {
        var cldbHostsString = $.clusterUnderTest.nodesHosting('mapr-cldb').map(function (n) { return n.host; }).join(',');
        var zookeeperHostsString = $.clusterUnderTest.nodesHosting('mapr-zookeeper').map(function (n) { return n.host; }).join(',');
        var historyHostString = $.clusterUnderTest.nodeHosting('mapr-historyserver').host;
        var configCommand = "/opt/mapr/server/configure.sh -C " + cldbHostsString + " -Z " + zookeeperHostsString + " -HS " + historyHostString + " -u mapr -g mapr -N " + $.clusterUnderTest.name;
        var result = $.clusterUnderTest.executeShellCommandOnEachNode(configCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.setMFSInstance = function (mfsInstances) {
        return $.expect($.clusterUnderTest.nodes().first().executeShellCommand("maprcli config save -values '{\"multimfs.numinstances.pernode\":\"" + mfsInstances + "}'")).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.createUserWithIdGroupAndPassword = function (user, userId, userGroup, userPasswd) {
        var userCreateComamnd = "id -u " + user + " || useradd -u " + userId + " -g " + userGroup + " -p $(openssl passwd -1 " + userPasswd + ") " + user;
        var groupCreateCommand = "getent group " + userGroup + " || groupadd -g " + userId + " " + userGroup;
        var resultList = $.clusterUnderTest.nodes().map(function (n) { return n.executeShellCommands($.collections.newList([groupCreateCommand, userCreateComamnd])); });
        return $.expectAll(resultList).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.performSSHCommandsAsUser = function (user, userPasswd, commands) {
        var commandList = $.collections.newList(commands.split("\n"));
        var nodeRequests = $.clusterUnderTest.nodes().map(function (n) {
            return $.sshAPI.newSSHClient().connect(n.host, user, userPasswd)
                .then(function (session) { return session.executeCommands(commandList); });
        });
        return $.expectAll(nodeRequests).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.addUserToSecondaryGroup = function (user, secondaryGroup) {
        var userToGroupCommand = "usermod -G " + secondaryGroup + " " + user;
        return $.expect(this.firstNonCldb.executeShellCommand(userToGroupCommand)).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.installMavenOnNonCLDBNode = function () {
        var getMvn = "wget http://www.carfab.com/apachesoftware/maven/maven-3/3.0.5/binaries/apache-maven-3.0.5-bin.tar.gz";
        var untarMvn = "tar -zxf apache-maven-3.0.5-bin.tar.gz";
        var copyMvn = "cp -R apache-maven-3.0.5 /usr/local";
        var symLink = "ln -s /usr/local/apache-maven-3.0.5/bin/mvn /usr/bin/mvn";
        var delMvn = "rm apache-maven-3.0.5-bin.tar.gz";
        this.firstNonCldb = $.clusterUnderTest.nodes().filter(function (n) { return !n.isHostingService('mapr-cldb'); }).first();
        var resultList = this.firstNonCldb.executeShellCommands($.collections.newList([getMvn, untarMvn, copyMvn, symLink, delMvn]));
        return $.expect(resultList).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.installGitOnNonCLDBNode = function () {
        var gitInstallCommand = this.firstNonCldb.packageManager.installPackageCommand('git');
        var result = this.firstNonCldb.executeShellCommand(gitInstallCommand);
        return $.expect(result).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.copyMavenSettingsFileToNonCldbNode = function () {
        var _this = this;
        var result = this.firstNonCldb.executeShellCommand("mkdir -p /root/.m2")
            .then(function (r) { return _this.firstNonCldb.upload('./data/ats-files/settings.xml', '/root/.m2/'); });
        return $.expect(result).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.cloneATSOnNodeFrom = function (atsPath) {
        var result = this.firstNonCldb.executeShellCommand("git clone " + atsPath);
        return $.expect(result).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.setupPasswordlessSSHFromCLDBNodeToOtherNodes = function () {
        var _this = this;
        var resultList = this.firstNonCldb.executeShellCommand("echo -e  'y' | ssh-keygen -t rsa -P '' -f /root/.ssh/id_rsa")
            .then(function (_) { return _this.firstNonCldb.executeShellCommand("cat /root/.ssh/id_rsa.pub"); })
            .then(function (result) {
            var rsaKey = result.processResult().stdoutLines().join('\n');
            return $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes().map(function (node) { return node.executeShellCommand("mkdir -p /root/.ssh")
                .then(function (_) { return node.executeShellCommand("echo \"" + rsaKey + "\" > /root/.ssh/authorized_keys"); }); }));
        });
        return $.expect(resultList).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.setStrictHostKeyCheckingToNoNonCLDBNode = function () {
        return $.expect(this.firstNonCldb.executeShellCommand('echo "StrictHostKeyChecking no" > /root/.ssh/config')).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.setGitSSHKey = function () {
        var _this = this;
        var changePerm = "chmod 600 /root/.ssh/maprqa_id_rsa";
        var addToConfig = "echo -e \"StrictHostKeyChecking no\nhost github.com\nHostName github.com\nIdentityFile /root/.ssh/maprqa_id_rsa\nUser git\" > /root/.ssh/config";
        var results = this.firstNonCldb.upload("./data/ats-files/maprqa_id_rsa", '/root/.ssh/').then(function (_) {
            return _this.firstNonCldb.executeShellCommands($.collections.newList([changePerm, addToConfig]));
        });
        return $.expect(results).to.eventually.be.fulfilled;
    };
    PackageManagerInstallationSteps.prototype.removeGitSSHKey = function () {
        var deleteKey = "rm -rf /root/.ssh/maprqa_id_rsa";
        var deleteConfig = "rm -rf /root/.ssh/config";
        var resultList = this.firstNonCldb.executeShellCommands($.collections.newList([deleteKey, deleteConfig]));
        return $.expect(resultList).to.eventually.be.fulfilled;
    };
    __decorate([
        cucumber_tsflow_1.given(/^I have updated the package manager$/)
    ], PackageManagerInstallationSteps.prototype, "updatePackageManagerOnAllNodes", null);
    __decorate([
        cucumber_tsflow_1.when(/^I install the latest patch, respecting the current variant, on all nodes list it as a dependency$/)
    ], PackageManagerInstallationSteps.prototype, "installLatestPatchWithRespectToVariant", null);
    __decorate([
        cucumber_tsflow_1.when(/^I install packages with the "([^"]*)" tag$/)
    ], PackageManagerInstallationSteps.prototype, "installPackagesWithTag", null);
    __decorate([
        cucumber_tsflow_1.given(/^I prepare the disk\.list file$/)
    ], PackageManagerInstallationSteps.prototype, "prepareDiskListFile", null);
    __decorate([
        cucumber_tsflow_1.given(/^I run configure\.sh on all nodes$/)
    ], PackageManagerInstallationSteps.prototype, "runConfigureOnAllNodes", null);
    __decorate([
        cucumber_tsflow_1.given(/^I install the license on cluster$/)
    ], PackageManagerInstallationSteps.prototype, "installLicenseOnCluster", null);
    __decorate([
        cucumber_tsflow_1.given(/^I run configure\.sh for spyglass components$/)
    ], PackageManagerInstallationSteps.prototype, "runConfigureForSpyglassComponents", null);
    __decorate([
        cucumber_tsflow_1.given(/^I use the package manager to install the "([^"]*)" package$/)
    ], PackageManagerInstallationSteps.prototype, "usePackageManagerToInstallSpecifiedPackage", null);
    __decorate([
        cucumber_tsflow_1.given(/^I remove all non-core components$/)
    ], PackageManagerInstallationSteps.prototype, "removeAllSpyglassComponents", null);
    __decorate([
        cucumber_tsflow_1.given(/^I remove all the core components$/)
    ], PackageManagerInstallationSteps.prototype, "removeAllCoreComponents", null);
    __decorate([
        cucumber_tsflow_1.given(/^I clear all mapr data$/)
    ], PackageManagerInstallationSteps.prototype, "clearAllMapRDataDirectories", null);
    __decorate([
        cucumber_tsflow_1.given(/^I run configure\.sh on all nodes without \-F$/)
    ], PackageManagerInstallationSteps.prototype, "runConfigureOnAllNodesWithoutDashFOption", null);
    __decorate([
        cucumber_tsflow_1.given(/^I set the mfs instance to "([^"]*)"$/)
    ], PackageManagerInstallationSteps.prototype, "setMFSInstance", null);
    __decorate([
        cucumber_tsflow_1.given(/^I create the user "([^"]*)" with id "([^"]*)" group "([^"]*)" and password "([^"]*)"$/)
    ], PackageManagerInstallationSteps.prototype, "createUserWithIdGroupAndPassword", null);
    __decorate([
        cucumber_tsflow_1.given(/^I perform the following ssh commands on each node in the cluster as user "([^"]*)" with password "([^"]*)":$/)
    ], PackageManagerInstallationSteps.prototype, "performSSHCommandsAsUser", null);
    __decorate([
        cucumber_tsflow_1.given(/^I add the user "([^"]*)" to secondary group "([^"]*)"$/)
    ], PackageManagerInstallationSteps.prototype, "addUserToSecondaryGroup", null);
    __decorate([
        cucumber_tsflow_1.given(/^I install maven on a non\-cldb node$/)
    ], PackageManagerInstallationSteps.prototype, "installMavenOnNonCLDBNode", null);
    __decorate([
        cucumber_tsflow_1.given(/^I install git on the non\-cldb node$/)
    ], PackageManagerInstallationSteps.prototype, "installGitOnNonCLDBNode", null);
    __decorate([
        cucumber_tsflow_1.given(/^I copy the maven settings file to the non\-cldb node$/)
    ], PackageManagerInstallationSteps.prototype, "copyMavenSettingsFileToNonCldbNode", null);
    __decorate([
        cucumber_tsflow_1.given(/^I clone ATS on the node from "([^"]*)"$/)
    ], PackageManagerInstallationSteps.prototype, "cloneATSOnNodeFrom", null);
    __decorate([
        cucumber_tsflow_1.given(/^I setup passwordless ssh from non\-cldb node to all other nodes$/)
    ], PackageManagerInstallationSteps.prototype, "setupPasswordlessSSHFromCLDBNodeToOtherNodes", null);
    __decorate([
        cucumber_tsflow_1.given(/^I set StrictHostKeyChecking option to no on non\-cldb node$/)
    ], PackageManagerInstallationSteps.prototype, "setStrictHostKeyCheckingToNoNonCLDBNode", null);
    __decorate([
        cucumber_tsflow_1.given(/^I set the git ssh key$/)
    ], PackageManagerInstallationSteps.prototype, "setGitSSHKey", null);
    __decorate([
        cucumber_tsflow_1.given(/^I remove the git ssh key$/)
    ], PackageManagerInstallationSteps.prototype, "removeGitSSHKey", null);
    PackageManagerInstallationSteps = __decorate([
        cucumber_tsflow_1.binding()
    ], PackageManagerInstallationSteps);
    return PackageManagerInstallationSteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PackageManagerInstallationSteps;
module.exports = PackageManagerInstallationSteps;
//# sourceMappingURL=package-manager-installation-steps.js.map
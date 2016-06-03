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
    PackageManagerInstallationSteps = __decorate([
        cucumber_tsflow_1.binding()
    ], PackageManagerInstallationSteps);
    return PackageManagerInstallationSteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PackageManagerInstallationSteps;
module.exports = PackageManagerInstallationSteps;
//# sourceMappingURL=package-manager-installation-steps.js.map
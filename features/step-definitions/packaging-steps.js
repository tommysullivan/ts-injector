"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var PackagingSteps = (function () {
    function PackagingSteps() {
    }
    PackagingSteps.prototype.setVersionAndNameOfDesiredPackage = function (version, packageName) {
        this.version = version;
        this.packageName = packageName;
    };
    PackagingSteps.prototype.setPromotionLevel = function (promotionLevel) {
        this.promotionLevel = promotionLevel;
    };
    PackagingSteps.prototype.setOperatingSystem = function (operatingSystem) {
        this.operatingSystem = operatingSystem;
    };
    PackagingSteps.prototype.createPackagSetsCollectionBasedOnConfig = function (packageSetsConfigJSONString) {
        var packageSetsJSONList = $.typedJSON.newListOfJSONObjects(JSON.parse(packageSetsConfigJSONString));
        this.packageSets = $.packaging.newPackageSets(packageSetsJSONList);
        $.expect(this.packageSets).not.to.be.null;
    };
    PackagingSteps.prototype.createRepositoriesCollectionBasedOnConfig = function (repositoriesConfigJSONString) {
        var repositoriesConfig = $.typedJSON.newListOfJSONObjects(JSON.parse(repositoriesConfigJSONString));
        this.repositories = $.packaging.newRepositories(repositoriesConfig, this.packageSets);
        $.expect(this.repositories).not.to.be.null;
    };
    PackagingSteps.prototype.useDefaultPackageSetsAndRepositories = function () {
        this.repositories = $.packaging.defaultRepositories;
        this.packageSets = $.packaging.defaultPackageSets;
        $.expect(this.repositories).not.to.be.null;
        $.expect(this.packageSets).not.to.be.null;
    };
    PackagingSteps.prototype.useDefaultReleasesCollection = function () {
        this.releases = $.releasing.defaultReleases;
        $.expect(this.releases).not.to.be.null;
    };
    PackagingSteps.prototype.createReleasesCollectionBasedOnConfig = function (releasesConfigJSONString) {
        this.releases = $.releasing.newReleases($.typedJSON.newListOfJSONObjects(JSON.parse(releasesConfigJSONString)), this.packageSets);
        $.expect(this.releases).not.to.be.null;
    };
    PackagingSteps.prototype.getJSONRepresentationOfPackagesInRepoLocatedAt = function (repositoryURL) {
        this.packagesMatchingConditions = this.repositories.repositoryAtUrl(repositoryURL).packages;
    };
    PackagingSteps.prototype.getPackagesForPhaseAndRelease = function (phaseName, releaseName) {
        this.packagesMatchingConditions = this.releases
            .releaseNamed(releaseName)
            .phaseNamed(phaseName)
            .packages;
    };
    PackagingSteps.prototype.getRepository = function () {
        this.repositoryMatchingPackage = this.repositories.repositoryHosting(this.packageName, this.version, this.promotionLevel, this.operatingSystem);
    };
    PackagingSteps.prototype.verifyRepositoryUrl = function (expectedUrl) {
        $.expect(this.repositoryMatchingPackage.url).to.equal(expectedUrl);
    };
    PackagingSteps.prototype.verifyMatchingPackagesHaveCorrectInfo = function (index, name, version, promotionLevel, operatingSystem) {
        var item = this.packagesMatchingConditions.itemAt(parseInt(index));
        $.expect(item.name).to.equal(name);
        $.expect(item.version.toString()).to.equal(version);
        $.expect(item.promotionLevel.name).to.equal(promotionLevel);
        $.expect(item.supportedOperatingSystems.toArray()).to.contain(operatingSystem.toLowerCase());
    };
    PackagingSteps.prototype.verifyPackageNameVersionAndPromoLevel = function (index, name, version, promotionLevel) {
        var item = this.packagesMatchingConditions.itemAt(parseInt(index));
        $.expect(item.name).to.equal(name);
        $.expect(item.version.toString()).to.equal(version);
        $.expect(item.promotionLevel.name).to.equal(promotionLevel);
    };
    __decorate([
        cucumber_tsflow_1.given(/^I want the "([^"]*)" version of the "([^"]*)" package$/)
    ], PackagingSteps.prototype, "setVersionAndNameOfDesiredPackage", null);
    __decorate([
        cucumber_tsflow_1.given(/^I want the version that was promoted to the "([^"]*)" level of the development lifecycle$/)
    ], PackagingSteps.prototype, "setPromotionLevel", null);
    __decorate([
        cucumber_tsflow_1.given(/^I am using the "([^"]*)" operating system$/)
    ], PackagingSteps.prototype, "setOperatingSystem", null);
    __decorate([
        cucumber_tsflow_1.given(/^I am using a packageSets collection based on the following configuration:$/)
    ], PackagingSteps.prototype, "createPackagSetsCollectionBasedOnConfig", null);
    __decorate([
        cucumber_tsflow_1.given(/^I am using a repositories collection based on the following configuration:$/)
    ], PackagingSteps.prototype, "createRepositoriesCollectionBasedOnConfig", null);
    __decorate([
        cucumber_tsflow_1.given(/^I am using the default packageSets and repositories collection$/)
    ], PackagingSteps.prototype, "useDefaultPackageSetsAndRepositories", null);
    __decorate([
        cucumber_tsflow_1.given(/^I am using the default releases collection$/)
    ], PackagingSteps.prototype, "useDefaultReleasesCollection", null);
    __decorate([
        cucumber_tsflow_1.given(/^I am using a releases collection based on the following configuration:$/)
    ], PackagingSteps.prototype, "createReleasesCollectionBasedOnConfig", null);
    __decorate([
        cucumber_tsflow_1.when(/^I ask for the packages with repository url "([^"]*)"$/)
    ], PackagingSteps.prototype, "getJSONRepresentationOfPackagesInRepoLocatedAt", null);
    __decorate([
        cucumber_tsflow_1.when(/^I ask for packages for the "([^"]*)" phase of the "([^"]*)" release$/)
    ], PackagingSteps.prototype, "getPackagesForPhaseAndRelease", null);
    __decorate([
        cucumber_tsflow_1.when(/^I ask for the repository$/)
    ], PackagingSteps.prototype, "getRepository", null);
    __decorate([
        cucumber_tsflow_1.then(/^the repository has the correct url of "([^"]*)"$/)
    ], PackagingSteps.prototype, "verifyRepositoryUrl", null);
    __decorate([
        cucumber_tsflow_1.then(/^package "([^"]*)" is named "([^"]*)" with version "([^"]*)", promotionLevel "([^"]*)" and operating system "([^"]*)"$/)
    ], PackagingSteps.prototype, "verifyMatchingPackagesHaveCorrectInfo", null);
    __decorate([
        cucumber_tsflow_1.then(/^package "([^"]*)" is named "([^"]*)" with version "([^"]*)", promotionLevel "([^"]*)"$/)
    ], PackagingSteps.prototype, "verifyPackageNameVersionAndPromoLevel", null);
    PackagingSteps = __decorate([
        cucumber_tsflow_1.binding()
    ], PackagingSteps);
    return PackagingSteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PackagingSteps;
module.exports = PackagingSteps;
//# sourceMappingURL=packaging-steps.js.map
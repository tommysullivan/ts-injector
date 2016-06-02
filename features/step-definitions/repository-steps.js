"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var RepositorySteps = (function () {
    function RepositorySteps() {
    }
    RepositorySteps.prototype.setPhase = function (phase) {
        this.phase = phase;
    };
    RepositorySteps.prototype.setRelease = function (release) {
        this.release = release;
    };
    RepositorySteps.prototype.setMaprCoreVersion = function (coreVersion) {
        this.coreVersion = coreVersion;
    };
    RepositorySteps.prototype.setOperatingSystem = function (operatingSystem) {
        this.operatingSystem = operatingSystem;
    };
    RepositorySteps.prototype.getRepoUrlForComponentFamily = function (componentFamily) {
        this.repositoryUrlObtainedFromAPI = $.repositories.newRepositoryUrlProvider().urlFor(this.phase, this.coreVersion, this.operatingSystem, componentFamily);
    };
    RepositorySteps.prototype.verifyRepositoryUrl = function (expectedUrl) {
        $.expect(this.repositoryUrlObtainedFromAPI).to.equal(expectedUrl);
    };
    RepositorySteps.prototype.getRepoConfigFileContent = function (componentFamily) {
        this.repositoryConfigFileContent = $.repositories.newRepositoryForOS(this.operatingSystem)
            .configFileContentFor(componentFamily, this.repositoryUrlObtainedFromAPI);
        console.log(this.repositoryConfigFileContent);
        $.expect(this.repositoryConfigFileContent).not.to.be.empty;
    };
    RepositorySteps.prototype.verifyConfigFileContainsCorrectUrl = function (componentFamily) {
        $.expect(this.repositoryConfigFileContent).to.contain(this.repositoryUrlObtainedFromAPI);
    };
    RepositorySteps.prototype.getRepoConfigFileLocation = function (componentFamily) {
        this.repositoryConfigFileLocation = $.repositories.newRepositoryForOS(this.operatingSystem)
            .configFileLocationFor(componentFamily);
        console.log(this.repositoryConfigFileLocation);
        $.expect(this.repositoryConfigFileLocation).not.to.be.empty;
    };
    RepositorySteps.prototype.verifyConfigFilelocationIsValidFileName = function () {
        $.expect(this.repositoryConfigFileLocation).not.to.contain(' ');
    };
    __decorate([
        cucumber_tsflow_1.given(/^it is the "([^"]*)" phase of the development lifecycle$/)
    ], RepositorySteps.prototype, "setPhase", null);
    __decorate([
        cucumber_tsflow_1.given(/^we are targeting the "([^"]*)" release$/)
    ], RepositorySteps.prototype, "setRelease", null);
    __decorate([
        cucumber_tsflow_1.given(/^the MapR Core version is "([^"]*)"$/)
    ], RepositorySteps.prototype, "setMaprCoreVersion", null);
    __decorate([
        cucumber_tsflow_1.given(/^we are using the "([^"]*)" family of Operating Systems$/)
    ], RepositorySteps.prototype, "setOperatingSystem", null);
    __decorate([
        cucumber_tsflow_1.when(/^I ask for the repository url for the "([^"]*)" component family$/)
    ], RepositorySteps.prototype, "getRepoUrlForComponentFamily", null);
    __decorate([
        cucumber_tsflow_1.then(/^I receive the appropriate repository url of "([^"]*)"$/)
    ], RepositorySteps.prototype, "verifyRepositoryUrl", null);
    __decorate([
        cucumber_tsflow_1.when(/^I ask for the repository configuration file content for the "([^"]*)" component family$/)
    ], RepositorySteps.prototype, "getRepoConfigFileContent", null);
    __decorate([
        cucumber_tsflow_1.then(/^it contains the url "([^"]*)"$/)
    ], RepositorySteps.prototype, "verifyConfigFileContainsCorrectUrl", null);
    __decorate([
        cucumber_tsflow_1.when(/^I ask for the repository configuration file location for the "([^"]*)" component family$/)
    ], RepositorySteps.prototype, "getRepoConfigFileLocation", null);
    __decorate([
        cucumber_tsflow_1.then(/^it contains a valid filename$/)
    ], RepositorySteps.prototype, "verifyConfigFilelocationIsValidFileName", null);
    RepositorySteps = __decorate([
        cucumber_tsflow_1.binding()
    ], RepositorySteps);
    return RepositorySteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RepositorySteps;
module.exports = RepositorySteps;
//# sourceMappingURL=repository-steps.js.map
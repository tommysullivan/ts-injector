"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var RestBasedInstallationSteps = (function () {
    function RestBasedInstallationSteps() {
    }
    RestBasedInstallationSteps.prototype.authenticateGUIInstallerRestClient = function () {
        var _this = this;
        var installerSessionRequest = $.clusterUnderTest.newAuthedInstallerSession()
            .then(function (s) { return _this.installerSession = s; });
        return $.expect(installerSessionRequest).to.eventually.be.fulfilled;
    };
    RestBasedInstallationSteps.prototype.saveDesiredClusterConfiguration = function () {
        var serverConfigSaveRequest = $.clusterTesting.newClusterInstaller().prepareAndSaveConfiguration($.clusterUnderTest);
        return $.expect(serverConfigSaveRequest).to.eventually.be.fulfilled;
    };
    RestBasedInstallationSteps.prototype.performClusterConfigurationVerification = function () {
        var _this = this;
        var verificationRequest = this.installerSession.process()
            .then(function (p) {
            _this.installerProcess = p;
            return p.validate();
        });
        return $.expect(verificationRequest).to.eventually.be.fulfilled;
    };
    RestBasedInstallationSteps.prototype.verifyInstallerWebServerStartsAndOutputsURLToStdOut = function () {
        var sshOutput = this.sshResult.processResult().stdoutLines().join('');
        $.expect(sshOutput.indexOf('To continue installing MapR software, open the following URL in a web browser')).not.to.equal(-1);
    };
    RestBasedInstallationSteps.prototype.performClusterProvisioning = function () {
        return $.expect(this.installerProcess.provision()).to.eventually.be.fulfilled;
    };
    RestBasedInstallationSteps.prototype.performClusterInstallation = function () {
        return $.expect(this.installerProcess.install()).to.eventually.be.fulfilled;
    };
    __decorate([
        cucumber_tsflow_1.given(/^I can authenticate my GUI Installer Rest Client$/)
    ], RestBasedInstallationSteps.prototype, "authenticateGUIInstallerRestClient", null);
    __decorate([
        cucumber_tsflow_1.given(/^I specify and save the desired Cluster Configuration$/)
    ], RestBasedInstallationSteps.prototype, "saveDesiredClusterConfiguration", null);
    __decorate([
        cucumber_tsflow_1.when(/^I perform Cluster Configuration Verification$/)
    ], RestBasedInstallationSteps.prototype, "performClusterConfigurationVerification", null);
    __decorate([
        cucumber_tsflow_1.then(/^it successfully starts the installer web server and outputs its URL to the screen$/)
    ], RestBasedInstallationSteps.prototype, "verifyInstallerWebServerStartsAndOutputsURLToStdOut", null);
    __decorate([
        cucumber_tsflow_1.when(/^I perform Cluster Provisioning$/)
    ], RestBasedInstallationSteps.prototype, "performClusterProvisioning", null);
    __decorate([
        cucumber_tsflow_1.when(/^I perform Cluster Installation$/)
    ], RestBasedInstallationSteps.prototype, "performClusterInstallation", null);
    RestBasedInstallationSteps = __decorate([
        cucumber_tsflow_1.binding()
    ], RestBasedInstallationSteps);
    return RestBasedInstallationSteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RestBasedInstallationSteps;
module.exports = RestBasedInstallationSteps;
//# sourceMappingURL=rest-based-installation-steps.js.map
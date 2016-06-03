"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var SCPSteps = (function () {
    function SCPSteps() {
    }
    SCPSteps.prototype.scpToRemoteHost = function (sourceFilePath, destinationHost, destinationFilePath) {
        var scpRequest = $.sshAPI.newSSHClient().connect(destinationHost, 'root', 'mapr')
            .then(function (s) { return s.upload(sourceFilePath, destinationFilePath); });
        return $.expect(scpRequest).to.eventually.be.fulfilled;
    };
    SCPSteps.prototype.downloadRemoteFileToLocalFilePath = function (remotePath, remoteHost, localPath) {
        var scpRequest = $.sshAPI.newSSHClient().connect(remoteHost, 'root', 'mapr')
            .then(function (s) { return s.download(remotePath, localPath); });
        return $.expect(scpRequest).to.eventually.be.fulfilled;
    };
    SCPSteps.prototype.writeStringContentFromMemoryToRemoteHost = function (content, remoteHost, destPath) {
        var scpRequest = $.sshAPI.newSSHClient().connect(remoteHost, 'root', 'mapr')
            .then(function (s) { return s.write(content, destPath); });
        return $.expect(scpRequest).to.eventually.be.fulfilled;
    };
    __decorate([
        cucumber_tsflow_1.when(/^I scp "([^"]*)" to "([^"]*)" at path "([^"]*)"$/)
    ], SCPSteps.prototype, "scpToRemoteHost", null);
    __decorate([
        cucumber_tsflow_1.when(/^I download "([^"]*)" from "([^"]*)" to "([^"]*)"$/)
    ], SCPSteps.prototype, "downloadRemoteFileToLocalFilePath", null);
    __decorate([
        cucumber_tsflow_1.when(/^I write "([^"]*)" to "([^"]*)" at path "([^"]*)"$/)
    ], SCPSteps.prototype, "writeStringContentFromMemoryToRemoteHost", null);
    SCPSteps = __decorate([
        cucumber_tsflow_1.binding()
    ], SCPSteps);
    return SCPSteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SCPSteps;
module.exports = SCPSteps;
//# sourceMappingURL=scp-steps.js.map
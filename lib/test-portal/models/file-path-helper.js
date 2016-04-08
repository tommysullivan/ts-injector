"use strict";
var FilePathHelper = (function () {
    function FilePathHelper(testPortalConfiguration, path) {
        this.testPortalConfiguration = testPortalConfiguration;
        this.path = path;
    }
    FilePathHelper.prototype.getTestResultFilePathFromId = function (resultId) {
        return this.path.join(this.testPortalConfiguration.fullyQualifiedResultsPath, resultId + ".json");
    };
    FilePathHelper.prototype.getTestConfigFilePathFromId = function (configId) {
        return this.path.join(this.testPortalConfiguration.fullyQualifiedConfigsPath, configId + ".json");
    };
    FilePathHelper.prototype.getTestCliInvocationFilePathFromId = function (cliDetailId) {
        return this.path.join(this.testPortalConfiguration.fullyQualifiedCLIInvocationsPath, cliDetailId + ".txt");
    };
    FilePathHelper.prototype.getTestResultFilePathFromHttpRequest = function (httpRequest) {
        return this.getTestResultFilePathFromId(httpRequest.params.getOrThrow('resultId'));
    };
    FilePathHelper.prototype.getTestConfigFilePathFromHttpRequest = function (httpRequest) {
        return this.getTestConfigFilePathFromId(httpRequest.params.getOrThrow('configId'));
    };
    FilePathHelper.prototype.getTestCliInvocationsFilePathFromHttpRequest = function (httpRequest) {
        return this.getTestCliInvocationFilePathFromId(httpRequest.params.getOrThrow('cliDetailId'));
    };
    return FilePathHelper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FilePathHelper;
//# sourceMappingURL=file-path-helper.js.map
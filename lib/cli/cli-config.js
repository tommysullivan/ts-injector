"use strict";
var CliConfig = (function () {
    function CliConfig(configJSON, basePathToUseForConfiguredRelativePaths, path) {
        this.configJSON = configJSON;
        this.basePathToUseForConfiguredRelativePaths = basePathToUseForConfiguredRelativePaths;
        this.path = path;
    }
    Object.defineProperty(CliConfig.prototype, "temporaryTestRunOutputFilePath", {
        get: function () {
            return this.path.join(this.basePathToUseForConfiguredRelativePaths, this.configJSON.stringPropertyNamed('temporaryTestRunOutputFilePathRelativeToThisConfigFile'));
        },
        enumerable: true,
        configurable: true
    });
    return CliConfig;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CliConfig;
//# sourceMappingURL=cli-config.js.map
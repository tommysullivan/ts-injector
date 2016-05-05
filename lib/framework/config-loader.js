"use strict";
var framework_configuration_1 = require("./framework-configuration");
var ConfigLoader = (function () {
    function ConfigLoader(process, fileSystem, path) {
        this.DEFAULT_CONFIG_PATH = 'configuration/config.json';
        this.CONFIG_PATH_ENV_VAR_NAME = 'configPath';
        this.process = process;
        this.fileSystem = fileSystem;
        this.path = path;
    }
    ConfigLoader.prototype.loadConfig = function () {
        return new framework_configuration_1.default(this.fileSystem.readJSONObjectFileSync(this.configPath), this.basePathToUseForConfiguredRelativePaths, this.path, this.process);
    };
    Object.defineProperty(ConfigLoader.prototype, "basePathToUseForConfiguredRelativePaths", {
        get: function () {
            return this.path.dirname(this.configPath);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigLoader.prototype, "configPath", {
        get: function () {
            //TODO: Make sure the default regardless of the cwd.
            return this.process.environmentVariables().hasKey(this.CONFIG_PATH_ENV_VAR_NAME)
                ? this.process.environmentVariableNamed(this.CONFIG_PATH_ENV_VAR_NAME)
                : this.DEFAULT_CONFIG_PATH;
        },
        enumerable: true,
        configurable: true
    });
    return ConfigLoader;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ConfigLoader;
//# sourceMappingURL=config-loader.js.map
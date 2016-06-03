"use strict";
var OperatingSystem = (function () {
    function OperatingSystem(configJSON, packageManager, systemInfoCommand) {
        this.configJSON = configJSON;
        this._packageManager = packageManager;
        this._systemInfoCommand = systemInfoCommand;
    }
    Object.defineProperty(OperatingSystem.prototype, "name", {
        get: function () { return this.configJSON.stringPropertyNamed('name'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperatingSystem.prototype, "version", {
        get: function () { return this.configJSON.stringPropertyNamed('version'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperatingSystem.prototype, "packageManager", {
        get: function () { return this._packageManager; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperatingSystem.prototype, "systemInfoCommand", {
        get: function () { return this._systemInfoCommand; },
        enumerable: true,
        configurable: true
    });
    return OperatingSystem;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OperatingSystem;
//# sourceMappingURL=operating-system.js.map
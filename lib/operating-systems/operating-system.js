"use strict";
var OperatingSystem = (function () {
    function OperatingSystem(configJSON, repository, systemInfoCommand) {
        this.configJSON = configJSON;
        this._repository = repository;
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
    Object.defineProperty(OperatingSystem.prototype, "repository", {
        get: function () { return this._repository; },
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
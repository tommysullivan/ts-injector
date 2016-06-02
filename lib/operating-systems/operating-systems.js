"use strict";
var operating_system_1 = require("./operating-system");
var OperatingSystems = (function () {
    function OperatingSystems(repositories) {
        this.repositories = repositories;
    }
    OperatingSystems.prototype.newOperatingSystemFromConfig = function (configJSON) {
        switch (configJSON.stringPropertyNamed('name').toLowerCase()) {
            case 'suse': return this.newSuse(configJSON);
            case 'ubuntu': return this.newUbuntu(configJSON);
            case 'centos': return this.newCentos(configJSON);
            default:
                throw new Error("Could not instantiate operating system for config " + configJSON.toString());
        }
    };
    OperatingSystems.prototype.newSuse = function (configJSON) {
        return new operating_system_1.default(configJSON, this.repositories.newZypperRepository(), 'cat /etc/os-release');
    };
    OperatingSystems.prototype.newUbuntu = function (configJSON) {
        return new operating_system_1.default(configJSON, this.repositories.newAptRepository(), 'lsb_release -a');
    };
    OperatingSystems.prototype.newCentos = function (configJSON) {
        return new operating_system_1.default(configJSON, this.repositories.newYumRepository(), 'cat /etc/centos-release');
    };
    return OperatingSystems;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OperatingSystems;
//# sourceMappingURL=operating-systems.js.map
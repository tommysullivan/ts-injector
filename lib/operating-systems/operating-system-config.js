"use strict";
var yum_repository_1 = require("../repositories/yum-repository");
var apt_repository_1 = require("../repositories/apt-repository");
var OperatingSystemConfig = (function () {
    function OperatingSystemConfig(operatingSystemJSON) {
        this.operatingSystemJSON = operatingSystemJSON;
    }
    Object.defineProperty(OperatingSystemConfig.prototype, "name", {
        get: function () {
            return this.operatingSystemJSON.stringPropertyNamed('name');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperatingSystemConfig.prototype, "version", {
        get: function () {
            return this.operatingSystemJSON.stringPropertyNamed('version');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperatingSystemConfig.prototype, "systemInfoCommand", {
        get: function () {
            return {
                "suse": "cat /etc/os-release",
                "centos": "cat /etc/centos-release",
                "ubuntu": "lsb_release -a"
            }[this.name.toLowerCase()];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperatingSystemConfig.prototype, "repository", {
        get: function () {
            var hostOS = this.name.toLowerCase();
            var isYum = hostOS == 'centos' || hostOS == 'redhat';
            return isYum
                ? new yum_repository_1.default()
                : new apt_repository_1.default();
        },
        enumerable: true,
        configurable: true
    });
    return OperatingSystemConfig;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OperatingSystemConfig;
//# sourceMappingURL=operating-system-config.js.map
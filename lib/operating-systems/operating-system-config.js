"use strict";
var yum_repository_1 = require("../repositories/yum-repository");
var apt_repository_1 = require("../repositories/apt-repository");
var zypper_repository_1 = require("../repositories/zypper-repository");
var OperatingSystemConfig = (function () {
    function OperatingSystemConfig(operatingSystemJSON, collections) {
        this.operatingSystemJSON = operatingSystemJSON;
        this.collections = collections;
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
            switch (hostOS) {
                case "centos":
                    return new yum_repository_1.default();
                case "ubuntu":
                    return new apt_repository_1.default(this.collections);
                case "suse":
                    return new zypper_repository_1.default();
                default:
                    console.log("Could not Identify OS .. returning centos :");
                    return new yum_repository_1.default();
            }
        },
        enumerable: true,
        configurable: true
    });
    return OperatingSystemConfig;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OperatingSystemConfig;
//# sourceMappingURL=operating-system-config.js.map
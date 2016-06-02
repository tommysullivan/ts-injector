"use strict";
var ZypperRepository = (function () {
    function ZypperRepository() {
    }
    ZypperRepository.prototype.configFileContentFor = function (componentFamily, repoUrl) {
        return [
            ("[" + componentFamily + "]"),
            ("name = " + componentFamily),
            "enabled = 1",
            ("baseurl = " + repoUrl),
            "protected = 1",
            "gpgcheck = 0"
        ].join("\n");
    };
    ZypperRepository.prototype.configFileLocationFor = function (componentFamily) {
        return "/etc/zypp/repos.d/test-automation-" + componentFamily + ".repo";
    };
    Object.defineProperty(ZypperRepository.prototype, "packageCommand", {
        get: function () {
            return 'zypper';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZypperRepository.prototype, "repoConfigDirectory", {
        get: function () {
            return '/etc/zypp/repos.d/';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZypperRepository.prototype, "uninstallCorePackagesCommand", {
        get: function () {
            return "rpm -qa | grep mapr | sed \":a;N;$!ba;s/\\n/ /g\" | xargs rpm -e";
        },
        enumerable: true,
        configurable: true
    });
    ZypperRepository.prototype.uninstallPackagesCommand = function (packageNames) {
        return this.packageCommand + " remove -y " + packageNames.join(' ');
    };
    Object.defineProperty(ZypperRepository.prototype, "installJavaCommand", {
        get: function () {
            return this.installPackageCommand('java-1_7_0-openjdk');
        },
        enumerable: true,
        configurable: true
    });
    ZypperRepository.prototype.installPackagesCommand = function (packageNames) {
        return this.packageCommand + " install -y " + packageNames.join(' ');
    };
    ZypperRepository.prototype.installPackageCommand = function (packageName) {
        return this.packageCommand + " install -y " + packageName;
    };
    Object.defineProperty(ZypperRepository.prototype, "packageUpdateCommand", {
        get: function () {
            return 'zypper refresh';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZypperRepository.prototype, "repoListCommand", {
        get: function () {
            return 'zypper repos';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZypperRepository.prototype, "packageListCommand", {
        get: function () {
            return 'rpm -qa';
        },
        enumerable: true,
        configurable: true
    });
    return ZypperRepository;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ZypperRepository;
//# sourceMappingURL=zypper-repository.js.map
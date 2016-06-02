"use strict";
var YumRepository = (function () {
    function YumRepository() {
    }
    YumRepository.prototype.configFileContentFor = function (componentFamily, repoUrl) {
        return [
            ("[" + componentFamily + "]"),
            ("name = " + componentFamily),
            "enabled = 1",
            ("baseurl = " + repoUrl),
            "protected = 1",
            "gpgcheck = 0"
        ].join("\n");
    };
    YumRepository.prototype.configFileLocationFor = function (componentFamily) {
        return "/etc/yum.repos.d/test-automation-" + componentFamily + ".repo";
    };
    Object.defineProperty(YumRepository.prototype, "packageCommand", {
        get: function () {
            return 'yum';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YumRepository.prototype, "repoConfigDirectory", {
        get: function () {
            return '/etc/yum.repos.d/';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YumRepository.prototype, "uninstallCorePackagesCommand", {
        get: function () {
            return "rpm -qa | grep mapr | sed \":a;N;$!ba;s/\\n/ /g\" | xargs rpm -e";
        },
        enumerable: true,
        configurable: true
    });
    YumRepository.prototype.uninstallPackagesCommand = function (packageNames) {
        return this.packageCommand + " remove -y " + packageNames.join(' ');
    };
    Object.defineProperty(YumRepository.prototype, "installJavaCommand", {
        get: function () {
            return this.installPackageCommand('java-1.7.0-openjdk');
        },
        enumerable: true,
        configurable: true
    });
    YumRepository.prototype.installPackagesCommand = function (packageNames) {
        return this.packageCommand + " install -y " + packageNames.join(' ');
    };
    YumRepository.prototype.installPackageCommand = function (packageName) {
        return this.packageCommand + " install -y " + packageName;
    };
    Object.defineProperty(YumRepository.prototype, "packageUpdateCommand", {
        get: function () {
            return 'yum clean all';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YumRepository.prototype, "repoListCommand", {
        get: function () {
            return 'yum repolist all';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YumRepository.prototype, "packageListCommand", {
        get: function () {
            return 'yum list installed';
        },
        enumerable: true,
        configurable: true
    });
    return YumRepository;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = YumRepository;
//# sourceMappingURL=yum-repository.js.map
"use strict";
var ZypperPackageManager = (function () {
    function ZypperPackageManager(configFileContent) {
        this.configFileContent = configFileContent;
    }
    ZypperPackageManager.prototype.clientConfigurationFileContentFor = function (repository, descriptiveName, tagName) {
        return this.configFileContent.clientConfigurationFileContentFor(repository, descriptiveName, tagName);
    };
    ZypperPackageManager.prototype.clientConfigurationFileLocationFor = function (packageName) {
        return "/etc/zypp/repos.d/test-automation-" + packageName + ".repo";
    };
    Object.defineProperty(ZypperPackageManager.prototype, "packageCommand", {
        get: function () {
            return 'zypper';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZypperPackageManager.prototype, "repoConfigDirectory", {
        get: function () {
            return '/etc/zypp/repos.d/';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZypperPackageManager.prototype, "uninstallAllPackagesWithMapRInTheName", {
        get: function () {
            return "rpm -qa | grep mapr | sed \":a;N;$!ba;s/\\n/ /g\" | xargs rpm -e";
        },
        enumerable: true,
        configurable: true
    });
    ZypperPackageManager.prototype.uninstallPackagesCommand = function (packageNames) {
        return this.packageCommand + " remove -y " + packageNames.join(' ');
    };
    Object.defineProperty(ZypperPackageManager.prototype, "installJavaCommand", {
        get: function () {
            return this.installPackageCommand('java-1_7_0-openjdk-devel');
        },
        enumerable: true,
        configurable: true
    });
    ZypperPackageManager.prototype.installPackagesCommand = function (packageNames) {
        return this.packageCommand + " install -y " + packageNames.join(' ');
    };
    ZypperPackageManager.prototype.installPackageCommand = function (packageName) {
        return this.packageCommand + " install -y " + packageName;
    };
    Object.defineProperty(ZypperPackageManager.prototype, "packageUpdateCommand", {
        get: function () {
            return 'zypper refresh';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZypperPackageManager.prototype, "repoListCommand", {
        get: function () {
            return 'zypper repos';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZypperPackageManager.prototype, "packageListCommand", {
        get: function () {
            return 'rpm -qa';
        },
        enumerable: true,
        configurable: true
    });
    return ZypperPackageManager;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ZypperPackageManager;
//# sourceMappingURL=zypper-package-manager.js.map
"use strict";
var YumPackageManager = (function () {
    function YumPackageManager(configFileContent) {
        this.configFileContent = configFileContent;
    }
    YumPackageManager.prototype.clientConfigurationFileContentFor = function (repository, descriptiveName, tagName) {
        return this.configFileContent.clientConfigurationFileContentFor(repository, descriptiveName, tagName);
    };
    YumPackageManager.prototype.clientConfigurationFileLocationFor = function (packageName) {
        return "/etc/yum.repos.d/test-automation-" + packageName + ".repo";
    };
    Object.defineProperty(YumPackageManager.prototype, "packageCommand", {
        get: function () {
            return 'yum';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YumPackageManager.prototype, "repoConfigDirectory", {
        get: function () {
            return '/etc/yum.repos.d/';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YumPackageManager.prototype, "uninstallAllPackagesWithMapRInTheName", {
        get: function () {
            return "rpm -qa | grep mapr | sed \":a;N;$!ba;s/\\n/ /g\" | xargs rpm -e";
        },
        enumerable: true,
        configurable: true
    });
    YumPackageManager.prototype.uninstallPackagesCommand = function (packageNames) {
        return this.packageCommand + " remove -y " + packageNames.join(' ');
    };
    Object.defineProperty(YumPackageManager.prototype, "installJavaCommand", {
        get: function () {
            return this.installPackageCommand('java-1.7.0-openjdk');
        },
        enumerable: true,
        configurable: true
    });
    YumPackageManager.prototype.installPackagesCommand = function (packageNames) {
        return this.packageCommand + " install -y " + packageNames.join(' ');
    };
    YumPackageManager.prototype.installPackageCommand = function (packageName) {
        return this.packageCommand + " install -y " + packageName;
    };
    Object.defineProperty(YumPackageManager.prototype, "packageUpdateCommand", {
        get: function () {
            return 'yum clean all';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YumPackageManager.prototype, "repoListCommand", {
        get: function () {
            return 'yum repolist all';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YumPackageManager.prototype, "packageListCommand", {
        get: function () {
            return 'yum list installed';
        },
        enumerable: true,
        configurable: true
    });
    return YumPackageManager;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = YumPackageManager;
//# sourceMappingURL=yum-package-manager.js.map
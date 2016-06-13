"use strict";
var AptPackageManager = (function () {
    function AptPackageManager() {
    }
    AptPackageManager.prototype.clientConfigurationFileContentFor = function (repository, descriptiveName, tagName) {
        if (tagName == 'core')
            return "deb " + repository.url + " mapr optional";
        else
            return "deb " + repository.url + " binary/";
    };
    AptPackageManager.prototype.clientConfigurationFileLocationFor = function (packageName) {
        return "/etc/apt/sources.list.d/test-automation-" + packageName + ".list";
    };
    AptPackageManager.prototype.installPackagesCommand = function (packageNames) {
        return this.packageCommand + " install -y " + packageNames.join(' ') + " --allow-unauthenticated";
    };
    Object.defineProperty(AptPackageManager.prototype, "uninstallAllPackagesWithMapRInTheName", {
        get: function () {
            return "dpkg -l | grep mapr | cut -d ' ' -f 3 | sed ':a;N;$!ba;s/\\n/ /g' | xargs apt-get purge -y";
        },
        enumerable: true,
        configurable: true
    });
    AptPackageManager.prototype.uninstallPackagesCommand = function (packageNames) {
        return this.packageCommand + " purge -y " + packageNames.join(' ');
    };
    Object.defineProperty(AptPackageManager.prototype, "installJavaCommand", {
        get: function () {
            return this.installPackageCommand('openjdk-7-jdk');
        },
        enumerable: true,
        configurable: true
    });
    AptPackageManager.prototype.installPackageCommand = function (packageName) {
        return this.packageCommand + " install -y " + packageName + " --allow-unauthenticated";
    };
    Object.defineProperty(AptPackageManager.prototype, "packageUpdateCommand", {
        get: function () {
            return 'apt-get update';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AptPackageManager.prototype, "packageCommand", {
        get: function () {
            return 'apt-get';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AptPackageManager.prototype, "repoListCommand", {
        get: function () {
            return 'apt-cache policy';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AptPackageManager.prototype, "packageListCommand", {
        get: function () {
            return 'dpkg -l';
        },
        enumerable: true,
        configurable: true
    });
    return AptPackageManager;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AptPackageManager;
//# sourceMappingURL=apt-package-manager.js.map
"use strict";
var AptRepository = (function () {
    function AptRepository() {
    }
    AptRepository.prototype.configFileContentFor = function (componentFamily, repoUrl) {
        return "deb " + repoUrl + " binary/";
    };
    AptRepository.prototype.configFileLocationFor = function (componentFamily) {
        return "/etc/apt/sources.list.d/test-automation-" + componentFamily + ".list";
    };
    AptRepository.prototype.installPackagesCommand = function (packageNames) {
        return this.packageCommand + " install -y " + packageNames.join(' ') + " --allow-unauthenticated";
    };
    Object.defineProperty(AptRepository.prototype, "uninstallCorePackagesCommand", {
        get: function () {
            return "dpkg -l | grep mapr | cut -d ' ' -f 3 | sed ':a;N;$!ba;s/\\n/ /g' | xargs apt-get purge -y";
        },
        enumerable: true,
        configurable: true
    });
    AptRepository.prototype.uninstallPackagesCommand = function (packageNames) {
        return this.packageCommand + " purge -y " + packageNames.join(' ');
    };
    Object.defineProperty(AptRepository.prototype, "installJavaCommand", {
        get: function () {
            return this.installPackageCommand('openjdk-7-jdk');
        },
        enumerable: true,
        configurable: true
    });
    AptRepository.prototype.installPackageCommand = function (packageName) {
        return this.packageCommand + " install -y " + packageName + " --allow-unauthenticated";
    };
    Object.defineProperty(AptRepository.prototype, "packageUpdateCommand", {
        get: function () {
            return 'apt-get update';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AptRepository.prototype, "packageCommand", {
        get: function () {
            return 'apt-get';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AptRepository.prototype, "repoListCommand", {
        get: function () {
            return 'apt-cache policy';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AptRepository.prototype, "packageListCommand", {
        get: function () {
            return 'dpkg -l';
        },
        enumerable: true,
        configurable: true
    });
    return AptRepository;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AptRepository;
//# sourceMappingURL=apt-repository.js.map
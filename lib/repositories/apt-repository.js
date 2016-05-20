"use strict";
var AptRepository = (function () {
    function AptRepository(collections) {
        this.collections = collections;
    }
    Object.defineProperty(AptRepository.prototype, "repoConfigDirectory", {
        get: function () {
            return '/etc/apt/sources.list.d/';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AptRepository.prototype, "patchRepoFileName", {
        get: function () {
            return 'mapr-patch-apt-get.list';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AptRepository.prototype, "coreRepoFileName", {
        get: function () {
            return 'mapr-apt-get.list';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AptRepository.prototype, "ecosystemRepoFileName", {
        get: function () {
            return 'ecosystem-apt-get.list';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AptRepository.prototype, "spyglassRepoFileName", {
        get: function () {
            return 'spyglass-apt-get.list';
        },
        enumerable: true,
        configurable: true
    });
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
    Object.defineProperty(AptRepository.prototype, "host", {
        get: function () {
            return 'apt.qa.lab';
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
    //TODO: Deduplicate and enable configurability
    AptRepository.prototype.pathFor = function (componentFamily) {
        return {
            "mapr-installer": "/installer-master-ui",
            "MapR Core": "/v5.1.0",
            "Ecosystem": "/opensource"
        }[componentFamily];
    };
    //TODO: Deduplicate and enable configurability
    AptRepository.prototype.urlFor = function (componentFamily) {
        return "http://" + this.host + this.pathFor(componentFamily);
    };
    return AptRepository;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AptRepository;
//# sourceMappingURL=apt-repository.js.map
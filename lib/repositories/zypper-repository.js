"use strict";
var ZypperRepository = (function () {
    function ZypperRepository() {
    }
    Object.defineProperty(ZypperRepository.prototype, "host", {
        get: function () {
            return 'yum.qa.lab';
        },
        enumerable: true,
        configurable: true
    });
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
    Object.defineProperty(ZypperRepository.prototype, "patchRepoFileName", {
        get: function () {
            return 'mapr-patch-yum.repo';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZypperRepository.prototype, "coreRepoFileName", {
        get: function () {
            return 'mapr-zypper.repo';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZypperRepository.prototype, "ecosystemRepoFileName", {
        get: function () {
            return 'ecosystem-yum.repo';
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
            return this.installPackageCommand('java');
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
    //TODO: Deduplicate and enable configurability
    ZypperRepository.prototype.pathFor = function (componentFamily) {
        return {
            "mapr-installer": "/installer-master-ui",
            "MapR Core": "/v5.1.0",
            "Ecosystem": "/opensource"
        }[componentFamily];
    };
    //TODO: Deduplicate and enable configurability
    ZypperRepository.prototype.urlFor = function (componentFamily) {
        return "http://" + this.host + this.pathFor(componentFamily);
    };
    return ZypperRepository;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ZypperRepository;
//# sourceMappingURL=zypper-repository.js.map
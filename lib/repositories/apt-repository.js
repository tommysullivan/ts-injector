"use strict";
var AptRepository = (function () {
    function AptRepository() {
    }
    Object.defineProperty(AptRepository.prototype, "type", {
        get: function () {
            return 'apt-get';
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
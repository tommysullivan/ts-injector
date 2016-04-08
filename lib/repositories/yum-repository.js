"use strict";
var YumRepository = (function () {
    function YumRepository() {
    }
    Object.defineProperty(YumRepository.prototype, "type", {
        get: function () {
            return 'yum';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YumRepository.prototype, "host", {
        get: function () {
            //TODO: Allow this to vary based on "phase"
            return 'yum.qa.lab';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YumRepository.prototype, "packageCommand", {
        get: function () {
            return 'yum';
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
    //TODO: Deduplicate and enable configurability
    YumRepository.prototype.pathFor = function (componentFamily) {
        return {
            "mapr-installer": "/installer-master-ui",
            "MapR Core": "/v5.1.0",
            "Ecosystem": "/opensource"
        }[componentFamily];
    };
    //TODO: Deduplicate and enable configurability
    YumRepository.prototype.urlFor = function (componentFamily) {
        return "http://" + this.host + this.pathFor(componentFamily);
    };
    return YumRepository;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = YumRepository;
//# sourceMappingURL=yum-repository.js.map
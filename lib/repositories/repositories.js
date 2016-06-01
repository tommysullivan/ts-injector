"use strict";
var yum_repository_1 = require("./yum-repository");
var zypper_repository_1 = require("./zypper-repository");
var apt_repository_1 = require("./apt-repository");
var repository_url_provider_1 = require("./repository-url-provider");
var Repositories = (function () {
    function Repositories(typedJson) {
        this.typedJson = typedJson;
    }
    Repositories.prototype.newRepositoryForOS = function (operatingSystemName) {
        switch (operatingSystemName.toLowerCase()) {
            case 'centos':
            case 'redhat': return this.newYumRepository();
            case 'ubuntu': return this.newAptRepository();
            case 'suse': return this.newZypperRepository();
            default: throw new Error("cannot create repository for OS \"" + operatingSystemName);
        }
    };
    Repositories.prototype.newYumRepository = function () {
        return new yum_repository_1.default();
    };
    Repositories.prototype.newZypperRepository = function () {
        return new zypper_repository_1.default();
    };
    Repositories.prototype.newAptRepository = function () {
        return new apt_repository_1.default();
    };
    Repositories.prototype.newRepositoryUrlProvider = function () {
        return new repository_url_provider_1.default(this.typedJson);
    };
    return Repositories;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Repositories;
//# sourceMappingURL=repositories.js.map
"use strict";
var InstallerServices = (function () {
    function InstallerServices(servicesJSON, collections, installer, authedRestClient) {
        this.servicesJSON = servicesJSON;
        this.collections = collections;
        this.installer = installer;
        this.authedRestClient = authedRestClient;
    }
    Object.defineProperty(InstallerServices.prototype, "serviceList", {
        get: function () {
            var _this = this;
            return this.servicesJSON.listOfJSONObjectsNamed('resources').map(function (installerServiceJSON) {
                return _this.installer.newInstallerService(installerServiceJSON, _this.authedRestClient);
            });
        },
        enumerable: true,
        configurable: true
    });
    InstallerServices.prototype.serviceMatchingNameAndVersion = function (serviceName, version) {
        return this.serviceList.firstWhere(function (s) { return s.name == serviceName && s.version == version; });
    };
    return InstallerServices;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InstallerServices;
//# sourceMappingURL=installer-services.js.map
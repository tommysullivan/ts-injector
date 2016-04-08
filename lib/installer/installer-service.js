"use strict";
var InstallerService = (function () {
    function InstallerService(installerServiceJSON, authedRestClient, typedJSON) {
        this.installerServiceJSON = installerServiceJSON;
        this.authedRestClient = authedRestClient;
        this.typedJSON = typedJSON;
    }
    Object.defineProperty(InstallerService.prototype, "name", {
        get: function () {
            return this.installerServiceJSON.stringPropertyNamed('name');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerService.prototype, "version", {
        get: function () {
            return this.installerServiceJSON.stringPropertyNamed('version');
        },
        enumerable: true,
        configurable: true
    });
    InstallerService.prototype.hostNames = function () {
        var _this = this;
        var serviceHostsURL = this.installerServiceJSON.dictionaryNamed('links').get('hosts');
        return this.authedRestClient.get(serviceHostsURL)
            .then(function (response) {
            var serviceHostsJSON = _this.typedJSON.newJSONObject(response.jsonBody());
            return serviceHostsJSON.listNamed('resources').map(function (r) { return r.id; });
        });
    };
    return InstallerService;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InstallerService;
//# sourceMappingURL=installer-service.js.map
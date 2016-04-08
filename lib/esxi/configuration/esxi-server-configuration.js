"use strict";
var ESXIServerConfiguration = (function () {
    function ESXIServerConfiguration(esxiServerJSON) {
        this.esxiServerJSON = esxiServerJSON;
    }
    Object.defineProperty(ESXIServerConfiguration.prototype, "id", {
        get: function () { return this.esxiServerJSON.stringPropertyNamed('id'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ESXIServerConfiguration.prototype, "host", {
        get: function () { return this.esxiServerJSON.stringPropertyNamed('host'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ESXIServerConfiguration.prototype, "username", {
        get: function () { return this.esxiServerJSON.stringPropertyNamed('username'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ESXIServerConfiguration.prototype, "password", {
        get: function () { return this.esxiServerJSON.stringPropertyNamed('password'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ESXIServerConfiguration.prototype, "type", {
        get: function () { return this.esxiServerJSON.stringPropertyNamed('type'); },
        enumerable: true,
        configurable: true
    });
    ESXIServerConfiguration.prototype.toJSON = function () { return this.esxiServerJSON.toRawJSON(); };
    return ESXIServerConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ESXIServerConfiguration;
//# sourceMappingURL=esxi-server-configuration.js.map
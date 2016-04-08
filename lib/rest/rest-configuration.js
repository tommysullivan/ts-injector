"use strict";
var RestConfiguration = (function () {
    function RestConfiguration(restConfigJSON) {
        this.restConfigJSON = restConfigJSON;
    }
    Object.defineProperty(RestConfiguration.prototype, "debugHTTP", {
        get: function () {
            return this.restConfigJSON.booleanPropertyNamed('debugHTTP');
        },
        enumerable: true,
        configurable: true
    });
    return RestConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RestConfiguration;
//# sourceMappingURL=rest-configuration.js.map
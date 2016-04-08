"use strict";
var OpenTSDBConfig = (function () {
    function OpenTSDBConfig(openTSDBConfigJSON) {
        this.openTSDBConfigJSON = openTSDBConfigJSON;
    }
    Object.defineProperty(OpenTSDBConfig.prototype, "openTSDBQueryPathTemplate", {
        get: function () {
            return this.openTSDBConfigJSON.getProperty('openTSDBQueryPathTemplate');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpenTSDBConfig.prototype, "openTSDBUrlTemplate", {
        get: function () {
            return this.openTSDBConfigJSON.getProperty('openTSDBUrlTemplate');
        },
        enumerable: true,
        configurable: true
    });
    return OpenTSDBConfig;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OpenTSDBConfig;
//# sourceMappingURL=open-tsdb-config.js.map
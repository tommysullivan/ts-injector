"use strict";
var MCSServiceInfo = (function () {
    function MCSServiceInfo(name, statusJSON) {
        this._name = name;
        this.statusJSON = statusJSON;
    }
    Object.defineProperty(MCSServiceInfo.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MCSServiceInfo.prototype, "isHealthy", {
        get: function () {
            var total = this.statusJSON.numericPropertyNamed('total');
            var numOnStandby = this.statusJSON.hasPropertyNamed('standby')
                ? this.statusJSON.numericPropertyNamed('standby')
                : 0;
            return total > 0
                && this.statusJSON.numericPropertyNamed('failed') === 0
                && this.statusJSON.numericPropertyNamed('stopped') === 0
                && this.statusJSON.numericPropertyNamed('active') + numOnStandby == total;
        },
        enumerable: true,
        configurable: true
    });
    return MCSServiceInfo;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MCSServiceInfo;
//# sourceMappingURL=mcs-service-info.js.map
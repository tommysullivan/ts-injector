"use strict";
var SnapshotConfiguration = (function () {
    function SnapshotConfiguration(stateJSON) {
        this.stateJSON = stateJSON;
    }
    Object.defineProperty(SnapshotConfiguration.prototype, "snapshotId", {
        get: function () { return this.stateJSON.numericPropertyNamed('snapshotId'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SnapshotConfiguration.prototype, "name", {
        get: function () { return this.stateJSON.stringPropertyNamed('name'); },
        enumerable: true,
        configurable: true
    });
    return SnapshotConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SnapshotConfiguration;
//# sourceMappingURL=snapshot-configuration.js.map
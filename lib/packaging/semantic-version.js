"use strict";
var SemanticVersion = (function () {
    function SemanticVersion(versionString) {
        this._versionString = versionString;
    }
    SemanticVersion.prototype.matches = function (versionString) {
        return this._versionString == versionString;
    };
    SemanticVersion.prototype.toString = function () {
        return this._versionString;
    };
    return SemanticVersion;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SemanticVersion;
//# sourceMappingURL=semantic-version.js.map
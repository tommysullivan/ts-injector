"use strict";
var PromotionLevel = (function () {
    function PromotionLevel(name) {
        this._name = name;
    }
    Object.defineProperty(PromotionLevel.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    PromotionLevel.prototype.equals = function (other) {
        return this.name == other.name;
    };
    return PromotionLevel;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PromotionLevel;
//# sourceMappingURL=promotion-level.js.map
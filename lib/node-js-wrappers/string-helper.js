"use strict";
var StringHelper = (function () {
    function StringHelper() {
    }
    StringHelper.prototype.trimSpaceFromMultiLineString = function (stringToTrim) {
        return stringToTrim.split("\n").map(function (l) { return l.trim(); }).join("\n");
    };
    return StringHelper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StringHelper;
//# sourceMappingURL=string-helper.js.map
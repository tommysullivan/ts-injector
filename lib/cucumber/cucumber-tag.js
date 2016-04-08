"use strict";
var CucumberTag = (function () {
    function CucumberTag(tagJSON) {
        this.tagJSON = tagJSON;
    }
    CucumberTag.prototype.name = function () { return this.tagJSON.stringPropertyNamed('name'); };
    return CucumberTag;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CucumberTag;
//# sourceMappingURL=cucumber-tag.js.map
"use strict";
var TestResultDescriptor = (function () {
    function TestResultDescriptor(urlFriendlyName, fullPath, fileStats) {
        this.urlFriendlyName = urlFriendlyName;
        this.fullPath = fullPath;
        this.fileStats = fileStats;
    }
    Object.defineProperty(TestResultDescriptor.prototype, "modifiedTime", {
        get: function () { return this.fileStats.mtime.getTime(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestResultDescriptor.prototype, "size", {
        get: function () { return this.fileStats.size; },
        enumerable: true,
        configurable: true
    });
    TestResultDescriptor.prototype.toJSON = function () {
        return {
            name: this.urlFriendlyName,
            href: this.urlFriendlyName,
            fullPath: this.fullPath,
            modifiedTime: this.modifiedTime,
            size: this.size
        };
    };
    return TestResultDescriptor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestResultDescriptor;
//# sourceMappingURL=test-result-descriptor.js.map
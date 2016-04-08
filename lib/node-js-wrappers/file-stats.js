"use strict";
var FileStats = (function () {
    function FileStats(nativeFileStats) {
        this.nativeFileStats = nativeFileStats;
    }
    Object.defineProperty(FileStats.prototype, "mtime", {
        get: function () {
            return this.nativeFileStats.mtime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileStats.prototype, "size", {
        get: function () {
            return this.nativeFileStats.size;
        },
        enumerable: true,
        configurable: true
    });
    return FileStats;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileStats;
//# sourceMappingURL=file-stats.js.map
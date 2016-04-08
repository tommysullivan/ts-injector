"use strict";
var FileStream = (function () {
    function FileStream(nativeFileStream) {
        this.nativeFileStream = nativeFileStream;
    }
    FileStream.prototype.pipe = function (pipeable) {
        this.nativeFileStream.pipe(pipeable);
    };
    return FileStream;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileStream;
//# sourceMappingURL=file-stream.js.map
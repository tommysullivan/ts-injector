"use strict";
var ShellEscaper = (function () {
    function ShellEscaper(shellEscape) {
        this._shellEscape = shellEscape;
    }
    ShellEscaper.prototype.shellEscape = function (shellText) {
        return this._shellEscape([shellText]);
    };
    return ShellEscaper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ShellEscaper;
//# sourceMappingURL=shell-escaper.js.map
"use strict";
var Console = (function () {
    function Console(nativeConsole, readLineSyncModule) {
        this.nativeConsole = nativeConsole;
        this.readLineSyncModule = readLineSyncModule;
    }
    Console.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        this.nativeConsole.log.apply(this.nativeConsole, args);
    };
    Console.prototype.askQuestion = function (questionText) {
        this.readLineSyncModule.question(questionText, {});
    };
    Console.prototype.askSensitiveQuestion = function (questionText) {
        this.readLineSyncModule.question(questionText, { hideEchoBack: true });
    };
    return Console;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Console;
//# sourceMappingURL=console.js.map
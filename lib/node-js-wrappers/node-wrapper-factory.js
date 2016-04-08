"use strict";
var process_result_1 = require("./process-result");
var process_1 = require("./process");
var console_1 = require("./console");
var file_system_1 = require("./file-system");
var file_stream_1 = require("./file-stream");
var NodeWrapperFactory = (function () {
    function NodeWrapperFactory(promiseFactory, childProcessModule, collections, fsModule, typedJSON, errors, pathModule, readLineSyncModule) {
        this.promiseFactory = promiseFactory;
        this.childProcessModule = childProcessModule;
        this.collections = collections;
        this.fsModule = fsModule;
        this.typedJSON = typedJSON;
        this.errors = errors;
        this.pathModule = pathModule;
        this.readLineSyncModule = readLineSyncModule;
    }
    Object.defineProperty(NodeWrapperFactory.prototype, "path", {
        get: function () {
            return this.pathModule;
        },
        enumerable: true,
        configurable: true
    });
    NodeWrapperFactory.prototype.newFileStream = function (nativeFileStream) {
        return new file_stream_1.default(nativeFileStream);
    };
    NodeWrapperFactory.prototype.newProcessResult = function (command, processExitCode, stdoutParts, stderrParts, shellInvocationError) {
        return new process_result_1.default(command, processExitCode, stdoutParts, stderrParts, shellInvocationError);
    };
    NodeWrapperFactory.prototype.newProcess = function (nativeProcess) {
        return new process_1.default(nativeProcess, this.promiseFactory, this.childProcessModule, this, this.collections);
    };
    NodeWrapperFactory.prototype.newConsole = function (nativeConsole) {
        return new console_1.default(nativeConsole, this.readLineSyncModule);
    };
    NodeWrapperFactory.prototype.fileSystem = function () {
        return new file_system_1.default(this.fsModule, this.typedJSON, this.collections, this.errors, this);
    };
    return NodeWrapperFactory;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NodeWrapperFactory;
//# sourceMappingURL=node-wrapper-factory.js.map
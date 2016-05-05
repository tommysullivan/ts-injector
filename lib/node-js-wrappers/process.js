"use strict";
var Process = (function () {
    function Process(nativeProcess, promiseFactory, childProcess, nodeWrapperFactory, collections) {
        this.nativeProcess = nativeProcess;
        this.promiseFactory = promiseFactory;
        this.childProcess = childProcess;
        this.nodeWrapperFactory = nodeWrapperFactory;
        this.collections = collections;
    }
    Process.prototype.environmentVariables = function () {
        return this.collections.newDictionary(this.nativeProcess.env);
    };
    Process.prototype.environmentVariableNamed = function (name) {
        try {
            return this.environmentVariables().getOrThrow(name);
        }
        catch (e) {
            throw new Error("environment variable \"" + name + "\" was not defined");
        }
    };
    Process.prototype.environmentVariableNamedOrDefault = function (name, defaultValueIfNotDefined) {
        return this.environmentVariables().hasKey(name)
            ? this.environmentVariableNamed(name)
            : defaultValueIfNotDefined;
    };
    Process.prototype.commandLineArguments = function () {
        return this.collections.newList(this.nativeProcess.argv);
    };
    Process.prototype.exit = function (exitCode) {
        this.nativeProcess.exit(exitCode);
    };
    Process.prototype.throwForMissingArg = function (argName, expectedPosition) {
        throw new Error("Expected command line argument \"" + argName + "\" in position " + expectedPosition + " but it was not found");
    };
    Process.prototype.getArgvOrThrow = function (argName, index) {
        return this.commandLineArguments().itemAt(index) || this.throwForMissingArg(argName, index);
    };
    Process.prototype.currentUserName = function () {
        return this.environmentVariables().get('USER');
    };
    Process.prototype.pathToNodeJSExecutable = function () {
        return this.nativeProcess.execPath;
    };
    Process.prototype.executeNodeProcess = function (command, environmentVariables) {
        var _this = this;
        var env = environmentVariables.clone();
        var nodeExecutable = this.pathToNodeJSExecutable();
        env.add('PATH', nodeExecutable);
        return this.promiseFactory.newPromise(function (resolve, reject) {
            var stdoutParts = _this.collections.newEmptyList();
            var stderrParts = _this.collections.newEmptyList();
            var cukeProcess = _this.childProcess.exec(_this.pathToNodeJSExecutable() + " " + command, env);
            cukeProcess.stdout.on('data', function (data) { stdoutParts.push(data); });
            cukeProcess.stderr.on('data', function (data) { stderrParts.push(data); });
            cukeProcess.on('close', function (processExitCode) {
                var stdoutLines = _this.collections.newList(stdoutParts.join('').split("\n"));
                var stderrLines = _this.collections.newList(stderrParts.join('').split("\n"));
                var processResult = _this.nodeWrapperFactory.newProcessResult(command, processExitCode, stdoutLines, stderrLines, null);
                if (processResult.hasError())
                    reject(processResult);
                else
                    resolve(processResult);
            });
        });
    };
    Process.prototype.processName = function () {
        return this.getArgvOrThrow('processName', 1);
    };
    return Process;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Process;
//# sourceMappingURL=process.js.map
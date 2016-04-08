"use strict";
var SSHSession = (function () {
    function SSHSession(nodemiralSession, promiseFactory, nodeWrapperFactory, collections, api, host, writeCommandsToStdout) {
        this.nodemiralSession = nodemiralSession;
        this.promiseFactory = promiseFactory;
        this.nodeWrapperFactory = nodeWrapperFactory;
        this.collections = collections;
        this.api = api;
        this.host = host;
        this.writeCommandsToStdout = writeCommandsToStdout;
    }
    SSHSession.prototype.executeCommands = function (commands) {
        var _this = this;
        return this.promiseFactory.newPromise(function (resolve, reject) {
            var results = _this.collections.newEmptyList();
            var executeNextCommand = function (commandsToExecute) {
                var commandToExecute = commandsToExecute.first();
                var remainingCommands = commandsToExecute.rest();
                if (commandToExecute == null)
                    return reject(new Error('Attempted to execute null command'));
                _this.executeCommand(commandToExecute)
                    .then(function (result) {
                    results.push(result);
                    remainingCommands.notEmpty()
                        ? executeNextCommand(remainingCommands)
                        : resolve(results);
                })
                    .catch(function (sshError) {
                    results.push(sshError.sshResult);
                    reject(_this.api.newSSHMultiCommandError(results));
                });
            };
            executeNextCommand(commands.map(function (i) { return i; }));
        });
    };
    SSHSession.prototype.executeCommand = function (command) {
        var _this = this;
        if (this.writeCommandsToStdout)
            console.log(command);
        return this.promiseFactory.newPromise(function (resolve, reject) {
            _this.nodemiralSession.execute(command, function (err, code, logs) {
                var processResult = _this.nodeWrapperFactory.newProcessResult(command, code, _this.collections.newList(logs.stdout.split("\n")), _this.collections.newList(logs.stderr.split("\n")), err);
                var result = _this.api.newSSHResult(_this.host, processResult);
                if (err)
                    reject(_this.api.newSSHError(err, result));
                else if (code != 0)
                    reject(_this.api.newSSHError("Process exited with nonzero exit code: " + code, result));
                else
                    resolve(result);
            });
        });
    };
    return SSHSession;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SSHSession;
//# sourceMappingURL=ssh-session.js.map
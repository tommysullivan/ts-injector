"use strict";
var SSHSession = (function () {
    function SSHSession(nodemiralSession, promiseFactory, nodeWrapperFactory, collections, api, host, writeCommandsToStdout, fileSystem, scp2Module, username, password) {
        this.nodemiralSession = nodemiralSession;
        this.promiseFactory = promiseFactory;
        this.nodeWrapperFactory = nodeWrapperFactory;
        this.collections = collections;
        this.api = api;
        this.host = host;
        this.writeCommandsToStdout = writeCommandsToStdout;
        this.fileSystem = fileSystem;
        this.scp2Module = scp2Module;
        this.username = username;
        this.password = password;
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
            _this.nodemiralSession.onError(function (error) {
                reject(_this.api.newSSHError(error, null));
            });
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
    SSHSession.prototype.upload = function (localPath, remotePath) {
        var _this = this;
        var fileContent = this.fileSystem.readFileSync(localPath);
        return this.promiseFactory.newPromise(function (resolve, reject) {
            _this.scp2Module.scp(localPath, _this.getSCP2Options(remotePath), _this.keyboardInteractiveClient, function (err) {
                if (err)
                    reject(err);
                else
                    resolve(null);
            });
        });
    };
    SSHSession.prototype.download = function (remotePath, localPath) {
        var _this = this;
        var fileContent = this.fileSystem.readFileSync(localPath);
        return this.promiseFactory.newPromise(function (resolve, reject) {
            _this.scp2Module.scp(_this.getSCP2Options(remotePath), localPath, _this.keyboardInteractiveClient, function (err) {
                if (err)
                    reject(err);
                else
                    resolve(null);
            });
        });
    };
    SSHSession.prototype.getSCP2Options = function (path) {
        return {
            host: this.host,
            username: this.username,
            password: this.password,
            tryKeyboard: true,
            path: path
        };
    };
    Object.defineProperty(SSHSession.prototype, "keyboardInteractiveClient", {
        get: function () {
            var _this = this;
            var client = new this.scp2Module.Client();
            client.on('keyboard-interactive', function (name, instr, lang, prompts, cb) {
                cb([_this.password]);
            });
            return client;
        },
        enumerable: true,
        configurable: true
    });
    return SSHSession;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SSHSession;
//# sourceMappingURL=ssh-session.js.map
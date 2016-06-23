"use strict";
var ssh_client_1 = require("./ssh-client");
var ssh_session_1 = require("./ssh-session");
var ssh_error_1 = require("./ssh-error");
var ssh_result_1 = require("./ssh-result");
var ssh_multi_command_error_1 = require("./ssh-multi-command-error");
var shell_escaper_1 = require("./shell-escaper");
require('./nodemiral-patch');
var scp2Module = require('scp2');
var shellEscapeModule = require('shell-escape');
var SSHAPI = (function () {
    function SSHAPI(nodemiralModule, promiseFactory, nodeWrapperFactory, collections, sshConfiguration, uuidGenerator, path, errors) {
        this.nodemiralModule = nodemiralModule;
        this.promiseFactory = promiseFactory;
        this.nodeWrapperFactory = nodeWrapperFactory;
        this.collections = collections;
        this.sshConfiguration = sshConfiguration;
        this.uuidGenerator = uuidGenerator;
        this.path = path;
        this.errors = errors;
    }
    SSHAPI.prototype.newSSHSession = function (host, nodemiralSession, username, password) {
        return new ssh_session_1.default(nodemiralSession, this.promiseFactory, this.nodeWrapperFactory, this.collections, this, host, this.sshConfiguration.writeCommandsToStdout, this.nodeWrapperFactory.fileSystem(), scp2Module, username, password, this.sshConfiguration.temporaryStorageLocation, this.uuidGenerator, this.path, this.errors);
    };
    SSHAPI.prototype.newSSHClient = function () {
        return new ssh_client_1.default(this.promiseFactory, this.newSSHSession.bind(this), this.nodemiralModule);
    };
    SSHAPI.prototype.newSSHError = function (message, sshResult) {
        return new ssh_error_1.default(message, sshResult);
    };
    SSHAPI.prototype.newSSHResult = function (host, processResult) {
        return new ssh_result_1.default(host, processResult);
    };
    SSHAPI.prototype.newSSHMultiCommandError = function (sshResults) {
        return new ssh_multi_command_error_1.default(sshResults);
    };
    SSHAPI.prototype.newShellEscaper = function () {
        return new shell_escaper_1.default(shellEscapeModule);
    };
    return SSHAPI;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SSHAPI;
//# sourceMappingURL=ssh-api.js.map
"use strict";
var SSHClient = (function () {
    function SSHClient(promiseFactory, sshSessionFactory, nodemiral) {
        this.promiseFactory = promiseFactory;
        this.sshSessionFactory = sshSessionFactory;
        this.nodemiral = nodemiral;
    }
    SSHClient.prototype.connect = function (host, username, password) {
        var credentials = {
            username: username,
            password: password
        };
        var options = {
            ssh: {
                "StrictHostKeyChecking": "no"
            }
        };
        var rawSession = this.nodemiral.session(host, credentials, options);
        var wrappedSession = this.sshSessionFactory(host, rawSession, username, password);
        return this.promiseFactory.newPromiseForImmediateValue(wrappedSession);
    };
    return SSHClient;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SSHClient;
//# sourceMappingURL=ssh-client.js.map
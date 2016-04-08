"use strict";
var SSHClient = (function () {
    function SSHClient(promiseFactory, sshSessionFactory, nodemiral) {
        this.promiseFactory = promiseFactory;
        this.sshSessionFactory = sshSessionFactory;
        this.nodemiral = nodemiral;
    }
    SSHClient.prototype.connect = function (host, username, password) {
        return this.promiseFactory.newPromiseForImmediateValue(this.sshSessionFactory(host, this.nodemiral.session(host, {
            username: username,
            password: password
        }, {
            ssh: {
                "StrictHostKeyChecking": "no"
            }
        })));
    };
    return SSHClient;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SSHClient;
//# sourceMappingURL=ssh-client.js.map
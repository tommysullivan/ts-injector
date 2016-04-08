"use strict";
var SSHConfiguration = (function () {
    function SSHConfiguration(sshConfigJSON) {
        this.sshConfigJSON = sshConfigJSON;
    }
    Object.defineProperty(SSHConfiguration.prototype, "writeCommandsToStdout", {
        get: function () {
            return this.sshConfigJSON.booleanPropertyNamed('writeCommandsToStdout');
        },
        enumerable: true,
        configurable: true
    });
    return SSHConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SSHConfiguration;
//# sourceMappingURL=ssh-configuration.js.map
"use strict";
var esxi_client_1 = require("./esxi-client");
var ESXI = (function () {
    function ESXI(sshAPI, collections, esxiConfiguration) {
        this.sshAPI = sshAPI;
        this.collections = collections;
        this.esxiConfiguration = esxiConfiguration;
    }
    ESXI.prototype.newESXIClient = function (host, username, password, vmId) {
        return new esxi_client_1.default(this.sshAPI, host, username, password, this.collections, vmId);
    };
    ESXI.prototype.esxiServers = function () {
        return this.esxiConfiguration.servers;
    };
    ESXI.prototype.esxiServerConfigurationForId = function (id) {
        return this.esxiServers().firstWhere(function (e) { return e.id == id; });
    };
    return ESXI;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ESXI;
//# sourceMappingURL=esxi.js.map
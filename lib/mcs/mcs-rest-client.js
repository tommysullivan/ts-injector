"use strict";
var MCSRestClient = (function () {
    function MCSRestClient(rest, mcsProtocolHostAndOptionalPort, mcsLoginPath, mcs) {
        this.rest = rest;
        this.mcsProtocolHostAndOptionalPort = mcsProtocolHostAndOptionalPort;
        this.mcsLoginPath = mcsLoginPath;
        this.mcs = mcs;
    }
    MCSRestClient.prototype.createAutheticatedSession = function (username, password) {
        var _this = this;
        var restClientAsPromised = this.rest.newRestClientAsPromised(this.mcsProtocolHostAndOptionalPort);
        var postPayload = {
            form: {
                username: username,
                password: password
            }
        };
        return restClientAsPromised.post(this.mcsLoginPath, postPayload)
            .then(function (ignoredResponse) { return _this.mcs.newMCSRestSession(restClientAsPromised); });
    };
    return MCSRestClient;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MCSRestClient;
//# sourceMappingURL=mcs-rest-client.js.map
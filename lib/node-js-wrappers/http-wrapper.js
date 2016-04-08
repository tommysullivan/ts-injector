"use strict";
var HTTP = (function () {
    function HTTP(nativeHttpModule, promiseFactory) {
        this.nativeHttpModule = nativeHttpModule;
        this.promiseFactory = promiseFactory;
    }
    HTTP.prototype.createServer = function (httpServer, hostName, port) {
        var _this = this;
        return this.promiseFactory.newPromise(function (resolve, reject) {
            _this.nativeHttpModule.createServer(httpServer).listen(port, hostName, function (error) {
                if (error)
                    reject(error);
                else
                    resolve("web server available at http://" + hostName + ":" + port);
            });
        });
    };
    return HTTP;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HTTP;
//# sourceMappingURL=http-wrapper.js.map
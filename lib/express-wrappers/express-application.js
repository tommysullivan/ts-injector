"use strict";
var ExpressApplication = (function () {
    function ExpressApplication(bodyParser, expressModule, nativeExpressApp, promiseFactory, http, expressWrappers) {
        this.port = 80;
        this.hostName = 'localhost';
        this.bodyParser = bodyParser;
        this.expressModule = expressModule;
        this.nativeExpressApp = nativeExpressApp;
        this.promiseFactory = promiseFactory;
        this.http = http;
        this.expressWrappers = expressWrappers;
    }
    ExpressApplication.prototype.setPort = function (port) {
        this.port = port;
        this.nativeExpressApp.set('port', port);
        return this;
    };
    ExpressApplication.prototype.setHostName = function (hostName) {
        this.hostName = hostName;
        return this;
    };
    ExpressApplication.prototype.addStaticWebContentPath = function (pathToFolderContainingStaticWebContent) {
        this.nativeExpressApp.use(this.expressModule.static(pathToFolderContainingStaticWebContent));
        return this;
    };
    ExpressApplication.prototype.automaticallyParseJSONBody = function (sizeLimitInMegabytes) {
        this.nativeExpressApp.use(this.bodyParser.json({ limit: sizeLimitInMegabytes + "mb" }));
        return this;
    };
    ExpressApplication.prototype.addHandler = function (httpMethod, path, controller) {
        var _this = this;
        this.nativeExpressApp[httpMethod](path, function (nativeExpressRequest, nativeExpressResponse) {
            controller[httpMethod](_this.expressWrappers.newExpressHttpRequest(nativeExpressRequest), _this.expressWrappers.newExpressHttpResponse(nativeExpressResponse));
        });
        return this;
    };
    ExpressApplication.prototype.get = function (path, controller) {
        return this.addHandler('get', path, controller);
    };
    ExpressApplication.prototype.put = function (path, controller) {
        return this.addHandler('put', path, controller);
    };
    ExpressApplication.prototype.post = function (path, controller) {
        return this.addHandler('post', path, controller);
    };
    ExpressApplication.prototype.delete = function (path, controller) {
        return this.addHandler('delete', path, controller);
    };
    ExpressApplication.prototype.start = function () {
        return this.http.createServer(this.nativeExpressApp, this.hostName, this.port);
    };
    return ExpressApplication;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExpressApplication;
//# sourceMappingURL=express-application.js.map
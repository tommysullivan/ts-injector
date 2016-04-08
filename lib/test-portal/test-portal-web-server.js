"use strict";
var TestPortalWebServer = (function () {
    function TestPortalWebServer(expressWrappers, testResultsController, testResultController, testConfigController, testCliInvocationsController, jqlQueryController, jiraSyncRequestController, testPortalConfiguration, path) {
        this.expressWrappers = expressWrappers;
        this.testResultsController = testResultsController;
        this.testResultController = testResultController;
        this.testConfigController = testConfigController;
        this.testCliInvocationsController = testCliInvocationsController;
        this.jqlQueryController = jqlQueryController;
        this.jiraSyncRequestController = jiraSyncRequestController;
        this.testPortalConfiguration = testPortalConfiguration;
        this.path = path;
    }
    TestPortalWebServer.prototype.startServer = function () {
        return this.expressWrappers.newExpressApplication()
            .setPort(this.testPortalConfiguration.httpPort)
            .setHostName(this.testPortalConfiguration.hostName)
            .addStaticWebContentPath(this.path.join(__dirname, 'static-web-content'))
            .automaticallyParseJSONBody(this.testPortalConfiguration.requestSizeLimitInMegabytes)
            .get(this.testPortalConfiguration.testCliInvocationsWebRoute, this.testCliInvocationsController)
            .post(this.testPortalConfiguration.jiraSyncRequestWebRoute, this.jiraSyncRequestController)
            .post(this.testPortalConfiguration.jqlQueryWebRoute, this.jqlQueryController)
            .get(this.testPortalConfiguration.testConfigWebRouteRoute, this.testConfigController)
            .get(this.testPortalConfiguration.testResultWebRoute, this.testResultController)
            .put(this.testPortalConfiguration.testResultWebRoute, this.testResultController)
            .get(this.testPortalConfiguration.testResultsWebRoute, this.testResultsController)
            .start();
    };
    return TestPortalWebServer;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestPortalWebServer;
//# sourceMappingURL=test-portal-web-server.js.map
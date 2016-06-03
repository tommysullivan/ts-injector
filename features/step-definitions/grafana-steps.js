"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var GrafanaSteps = (function () {
    function GrafanaSteps() {
    }
    GrafanaSteps.prototype.verifyAuthenticatedGrafanaRestClientExists = function () {
        var _this = this;
        return $.expect($.grafana.newGrafanaRestClient().createAutheticatedSessionWithDefaultCredentials()
            .then(function (grafanaRestSession) { return _this.grafanaRestSession = grafanaRestSession; })).to.eventually.be.fulfilled;
    };
    GrafanaSteps.prototype.requestDashboardDefinitionImports = function (table) {
        var _this = this;
        var dashboardNames = $.cucumber.getListOfStringsFromTable(table);
        var fqdns = $.clusterUnderTest.nodes().map(function (n) { return n.host; });
        var uploadPromises = dashboardNames.map(function (dashboardName) { return _this.grafanaRestSession.uploadGrafanaDashboard(dashboardName, fqdns); });
        return $.expectAll(uploadPromises).to.eventually.be.fulfilled;
    };
    GrafanaSteps.prototype.validateReportsAreAvailableToView = function (callback) {
        callback.pending();
    };
    __decorate([
        cucumber_tsflow_1.given(/^I have an authenticated grafana rest client$/)
    ], GrafanaSteps.prototype, "verifyAuthenticatedGrafanaRestClientExists", null);
    __decorate([
        cucumber_tsflow_1.when(/^I request to import the following dashboard definitions:$/)
    ], GrafanaSteps.prototype, "requestDashboardDefinitionImports", null);
    __decorate([
        cucumber_tsflow_1.then(/^the reports are all available to view$/)
    ], GrafanaSteps.prototype, "validateReportsAreAvailableToView", null);
    GrafanaSteps = __decorate([
        cucumber_tsflow_1.binding()
    ], GrafanaSteps);
    return GrafanaSteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GrafanaSteps;
module.exports = GrafanaSteps;
//# sourceMappingURL=grafana-steps.js.map
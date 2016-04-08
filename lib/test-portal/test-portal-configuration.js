"use strict";
var TestPortalConfiguration = (function () {
    function TestPortalConfiguration(configJSON, basePathToUseForConfiguredRelativePaths, path) {
        this.configJSON = configJSON;
        this.basePathToUseForConfiguredRelativePaths = basePathToUseForConfiguredRelativePaths;
        this.path = path;
    }
    Object.defineProperty(TestPortalConfiguration.prototype, "testResultsWebRoute", {
        get: function () { return this.configJSON.stringPropertyNamed('testResultsWebRoute'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestPortalConfiguration.prototype, "testResultWebRoute", {
        get: function () { return this.configJSON.stringPropertyNamed('testResultWebRoute'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestPortalConfiguration.prototype, "testConfigWebRouteRoute", {
        get: function () { return this.configJSON.stringPropertyNamed('testConfigWebRouteRoute'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestPortalConfiguration.prototype, "testCliInvocationsWebRoute", {
        get: function () { return this.configJSON.stringPropertyNamed('testCliInvocationsWebRoute'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestPortalConfiguration.prototype, "jqlQueryWebRoute", {
        get: function () { return this.configJSON.stringPropertyNamed('jqlQueryWebRoute'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestPortalConfiguration.prototype, "jiraSyncRequestWebRoute", {
        get: function () { return this.configJSON.stringPropertyNamed('jiraSyncRequestWebRoute'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestPortalConfiguration.prototype, "requestSizeLimitInMegabytes", {
        get: function () { return this.configJSON.numericPropertyNamed('requestSizeLimitInMegabytes'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestPortalConfiguration.prototype, "httpPort", {
        get: function () { return this.configJSON.numericPropertyNamed('httpPort'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestPortalConfiguration.prototype, "hostName", {
        get: function () { return this.configJSON.stringPropertyNamed('hostName'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestPortalConfiguration.prototype, "maxResultsForExplorer", {
        get: function () { return this.configJSON.numericPropertyNamed('maxResultsForExplorer'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestPortalConfiguration.prototype, "fullyQualifiedResultsPath", {
        get: function () {
            return this.path.join(this.basePathToUseForConfiguredRelativePaths, this.configJSON.stringPropertyNamed('testResultPathRelativeToThisConfigFile'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestPortalConfiguration.prototype, "fullyQualifiedConfigsPath", {
        get: function () { throw new Error('not impl'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestPortalConfiguration.prototype, "fullyQualifiedCLIInvocationsPath", {
        get: function () { throw new Error('not impl'); },
        enumerable: true,
        configurable: true
    });
    return TestPortalConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestPortalConfiguration;
//# sourceMappingURL=test-portal-configuration.js.map
"use strict";
var rest_configuration_1 = require("../rest/rest-configuration");
var mcs_configuration_1 = require("../mcs/mcs-configuration");
var installer_client_configuration_1 = require("../installer/installer-client-configuration");
var cluster_testing_configuration_1 = require("../cluster-testing/cluster-testing-configuration");
var cucumber_configuration_1 = require("../cucumber/cucumber-configuration");
var ssh_configuration_1 = require("../ssh/ssh-configuration");
var open_tsdb_config_1 = require("../open-tsdb/open-tsdb-config");
var elasticsearch_configuration_1 = require("../elasticsearch/elasticsearch-configuration");
var esxi_configuration_1 = require("../esxi/configuration/esxi-configuration");
var test_portal_configuration_1 = require("../test-portal/test-portal-configuration");
var jira_configuration_1 = require("../jira/jira-configuration");
var cli_config_1 = require("../cli/cli-config");
var FrameworkConfiguration = (function () {
    function FrameworkConfiguration(frameworkConfigJSON, basePathToUseForConfiguredRelativePaths, path, process) {
        this.frameworkConfigJSON = frameworkConfigJSON;
        this.basePathToUseForConfiguredRelativePaths = basePathToUseForConfiguredRelativePaths;
        this.path = path;
        this.process = process;
    }
    Object.defineProperty(FrameworkConfiguration.prototype, "releasingConfig", {
        get: function () {
            return this.frameworkConfigJSON.jsonObjectNamed('releasing');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameworkConfiguration.prototype, "packagingConfigJSON", {
        get: function () {
            return this.frameworkConfigJSON.jsonObjectNamed('packaging');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameworkConfiguration.prototype, "rest", {
        get: function () {
            return new rest_configuration_1.default(this.frameworkConfigJSON.jsonObjectNamed('rest'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameworkConfiguration.prototype, "grafanaConfig", {
        get: function () {
            return this.frameworkConfigJSON.jsonObjectNamed('grafana');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameworkConfiguration.prototype, "cliConfig", {
        get: function () {
            return new cli_config_1.default(this.frameworkConfigJSON.jsonObjectNamed('cli'), this.basePathToUseForConfiguredRelativePaths, this.path);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameworkConfiguration.prototype, "testPortalConfig", {
        get: function () {
            return new test_portal_configuration_1.default(this.frameworkConfigJSON.jsonObjectNamed('testPortal'), this.basePathToUseForConfiguredRelativePaths, this.path, this.process);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameworkConfiguration.prototype, "jiraConfig", {
        get: function () {
            return new jira_configuration_1.default(this.frameworkConfigJSON.jsonObjectNamed('jira'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameworkConfiguration.prototype, "mcs", {
        get: function () {
            return new mcs_configuration_1.default(this.frameworkConfigJSON.jsonObjectNamed('mcs'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameworkConfiguration.prototype, "installerClient", {
        get: function () {
            return new installer_client_configuration_1.default(this.frameworkConfigJSON.jsonObjectNamed('installerClient'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameworkConfiguration.prototype, "clusterTesting", {
        get: function () {
            return new cluster_testing_configuration_1.default(this.frameworkConfigJSON.jsonObjectNamed('clusterTesting'), this.basePathToUseForConfiguredRelativePaths, this.path, this.process);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameworkConfiguration.prototype, "cucumber", {
        get: function () {
            return new cucumber_configuration_1.default(this.frameworkConfigJSON.jsonObjectNamed('cucumber'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameworkConfiguration.prototype, "ssh", {
        get: function () {
            return new ssh_configuration_1.default(this.frameworkConfigJSON.jsonObjectNamed('ssh'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameworkConfiguration.prototype, "openTSDBConfig", {
        get: function () {
            return new open_tsdb_config_1.default(this.frameworkConfigJSON.jsonObjectNamed('openTSDB'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameworkConfiguration.prototype, "elasticSearchConfiguration", {
        get: function () {
            return new elasticsearch_configuration_1.default(this.frameworkConfigJSON.jsonObjectNamed('elasticsearch'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameworkConfiguration.prototype, "clustersConfig", {
        get: function () {
            return this.frameworkConfigJSON.listOfJSONObjectsNamed('clusters');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameworkConfiguration.prototype, "esxiConfiguration", {
        get: function () {
            return new esxi_configuration_1.default(this.frameworkConfigJSON.jsonObjectNamed('esxi'));
        },
        enumerable: true,
        configurable: true
    });
    FrameworkConfiguration.prototype.toJSON = function () {
        return this.frameworkConfigJSON.toRawJSON();
    };
    return FrameworkConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FrameworkConfiguration;
//# sourceMappingURL=framework-configuration.js.map
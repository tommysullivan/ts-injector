"use strict";
var clusters_1 = require("../clusters/clusters");
var spyglass_1 = require("../spyglass/spyglass");
var cucumber_1 = require("../cucumber/cucumber");
var cluster_testing_1 = require("../cluster-testing/cluster-testing");
var cli_1 = require("../cli/cli");
var open_tsdb_1 = require("../open-tsdb/open-tsdb");
var esxi_1 = require("../esxi/esxi");
var elasticsearch_1 = require("../elasticsearch/elasticsearch");
var mcs_1 = require("../mcs/mcs");
var installer_1 = require("../installer/installer");
var service_discoverer_1 = require("../cluster-testing/service-discoverer");
var versioning_1 = require("../versioning/versioning");
var test_portal_1 = require("../test-portal/test-portal");
var jira_1 = require("../jira/jira");
var Framework = (function () {
    function Framework(frameworkConfig, process, fileSystem, uuidGenerator, collections, errors, promiseFactory, typedJSON, sshAPI, nodeWrapperFactory, chai, console, rest, expressWrappers) {
        this.frameworkConfig = frameworkConfig;
        this.process = process;
        this.fileSystem = fileSystem;
        this.uuidGenerator = uuidGenerator;
        this.collections = collections;
        this.errors = errors;
        this.promiseFactory = promiseFactory;
        this.typedJSON = typedJSON;
        this.sshAPI = sshAPI;
        this.nodeWrapperFactory = nodeWrapperFactory;
        this.chai = chai;
        this.console = console;
        this.rest = rest;
        this.expressWrappers = expressWrappers;
        this._testRunGUID = this.uuidGenerator.v4();
    }
    Object.defineProperty(Framework.prototype, "testPortal", {
        get: function () {
            return new test_portal_1.default(this.frameworkConfig.testPortalConfig, this.expressWrappers, this.nodeWrapperFactory, this.jira, this.process, this.promiseFactory, this.collections, this.console);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framework.prototype, "jira", {
        get: function () {
            return new jira_1.default(this.frameworkConfig.jiraConfig, this.rest);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framework.prototype, "testRunGUID", {
        get: function () {
            return this._testRunGUID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framework.prototype, "openTSDB", {
        get: function () { return new open_tsdb_1.default(this.rest, this.frameworkConfig.openTSDBConfig); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framework.prototype, "spyglass", {
        get: function () { return new spyglass_1.default(this.frameworkConfig.spyglassConfig, this.errors); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framework.prototype, "esxi", {
        get: function () { return new esxi_1.default(this.sshAPI, this.collections, this.frameworkConfig.esxiConfiguration); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framework.prototype, "clusters", {
        get: function () { return new clusters_1.default(this.frameworkConfig.clustersConfig, this.esxi, this.errors); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framework.prototype, "versioning", {
        get: function () { return new versioning_1.default(this.frameworkConfig.versioningConfig); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framework.prototype, "serviceDiscoverer", {
        get: function () {
            return new service_discoverer_1.default(this.versioning, this.promiseFactory, this.errors);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framework.prototype, "elasticSearch", {
        get: function () {
            return new elasticsearch_1.default(this.rest, this.frameworkConfig.elasticSearchConfiguration);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framework.prototype, "mcs", {
        get: function () {
            return new mcs_1.default(this.frameworkConfig.mcs, this.rest, this.typedJSON, this.errors);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framework.prototype, "installer", {
        get: function () {
            return new installer_1.default(this.frameworkConfig.installerClient, this.rest, this.promiseFactory, this.collections, this.typedJSON);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framework.prototype, "clusterTesting", {
        get: function () {
            return new cluster_testing_1.default(this.frameworkConfig.clusterTesting, this.promiseFactory, this.sshAPI.newSSHClient(), this.collections, this.versioning, this.mcs, this.openTSDB, this.installer, this.elasticSearch, this.serviceDiscoverer, this.esxi, this.clusters);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framework.prototype, "cli", {
        get: function () {
            return new cli_1.default(this.process, this.console, this.collections, this.frameworkConfig.clusterTesting, this.uuidGenerator, this.cucumber, this.clusters, this.clusterTesting, this.frameworkConfig, this.testPortal, this.nodeWrapperFactory.path, this.frameworkConfig.cliConfig, this.fileSystem, this.rest, this.promiseFactory);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framework.prototype, "cucumber", {
        get: function () {
            return new cucumber_1.default(this.collections, this.fileSystem, this.frameworkConfig.cucumber, this.errors);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framework.prototype, "clusterUnderTest", {
        get: function () {
            var clusterConfig = this.clusters.clusterConfigurationWithId(this.process.environmentVariableNamed('clusterId'));
            return this.clusterTesting.newClusterUnderTest(clusterConfig);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framework.prototype, "spyglassHealthChecker", {
        get: function () {
            return this.spyglass.newSpyglassHealthChecker();
        },
        enumerable: true,
        configurable: true
    });
    Framework.prototype.expect = function (target, message) {
        var _this = this;
        if (typeof (target['then']) == 'function') {
            var targetAsPromise = target;
            var targetWithErrorMessageHelper = targetAsPromise
                .catch(function (error) {
                if (_this.frameworkConfig.cucumber.embedAsyncErrorsInStepOutput)
                    console.log(error.toJSON ? error.toJSON() : error.toString());
                throw error.toString();
            });
            return this.chai.expect(targetWithErrorMessageHelper);
        }
        else
            return this.chai.expect(target, message);
    };
    Framework.prototype.expectAll = function (target) {
        return this.expect(this.promiseFactory.newGroupPromise(target));
    };
    Framework.prototype.assertEmptyList = function (list) {
        if (list.notEmpty())
            throw new this.chai.AssertionError("expected empty list, got " + list.toJSONString());
    };
    return Framework;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Framework;
//# sourceMappingURL=framework.js.map
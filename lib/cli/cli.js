"use strict";
var cli_executor_1 = require("./cli-executor");
var cucumber_cli_helper_1 = require("./cucumber-cli-helper");
var cluster_cli_helper_1 = require("./cluster-cli-helper");
var cluster_tester_cli_helper_1 = require("./cluster-tester-cli-helper");
var cli_helper_1 = require("./cli-helper");
var cluster_snapshot_cli_helper_1 = require("./cluster-snapshot-cli-helper");
var Cli = (function () {
    function Cli(process, console, collections, clusterTestingConfiguration, cucumber, clusters, clusterTesting, testPortal, cliConfig, promiseFactory) {
        this.process = process;
        this.console = console;
        this.collections = collections;
        this.clusterTestingConfiguration = clusterTestingConfiguration;
        this.cucumber = cucumber;
        this.clusters = clusters;
        this.clusterTesting = clusterTesting;
        this.testPortal = testPortal;
        this.cliConfig = cliConfig;
        this.promiseFactory = promiseFactory;
    }
    Cli.prototype.newExecutor = function () {
        var cliHelper = new cli_helper_1.default(this.process, this.console, this.clusterTesting, this.clusters);
        return new cli_executor_1.default(this.process, this.console, new cucumber_cli_helper_1.default(this.console, this.cucumber, this.process, this.cliConfig.temporaryTestRunOutputFilePath), new cluster_cli_helper_1.default(this.process, this.console, this.collections, cliHelper, new cluster_snapshot_cli_helper_1.default(this.process, this.console, cliHelper, this.clusters, this.clusterTesting), this.clusters, this.clusterTesting), new cluster_tester_cli_helper_1.default(this.process, this.console, this.cucumber, this.clusterTestingConfiguration, this.clusterTesting, this.clusters, this.promiseFactory, this.collections, this.clusterTesting.newMultiClusterTester(), cliHelper), this.testPortal, cliHelper);
    };
    return Cli;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Cli;
//# sourceMappingURL=cli.js.map
"use strict";
var cli_executor_1 = require("./cli-executor");
var cucumber_cli_helper_1 = require("./cucumber-cli-helper");
var cluster_cli_helper_1 = require("./cluster-cli-helper");
var cluster_tester_cli_helper_1 = require("./cluster-tester-cli-helper");
var cli_helper_1 = require("./cli-helper");
var cluster_snapshot_cli_helper_1 = require("./cluster-snapshot-cli-helper");
var Cli = (function () {
    function Cli(process, console, collections, clusterTestingConfiguration, uuidGenerator, cucumber, clusters, clusterTesting, frameworkConfig, testPortal, path, cliConfig, fileSystem, rest, promiseFactory) {
        this.process = process;
        this.console = console;
        this.collections = collections;
        this.clusterTestingConfiguration = clusterTestingConfiguration;
        this.uuidGenerator = uuidGenerator;
        this.cucumber = cucumber;
        this.clusters = clusters;
        this.clusterTesting = clusterTesting;
        this.frameworkConfig = frameworkConfig;
        this.testPortal = testPortal;
        this.path = path;
        this.cliConfig = cliConfig;
        this.fileSystem = fileSystem;
        this.rest = rest;
        this.promiseFactory = promiseFactory;
    }
    Cli.prototype.newExecutor = function () {
        var cliHelper = new cli_helper_1.default(this.process, this.console, this.clusterTesting, this.clusters);
        return new cli_executor_1.default(this.process, this.console, new cucumber_cli_helper_1.default(this.console, this.cucumber, this.process, this.cliConfig.temporaryTestRunOutputFilePath), new cluster_cli_helper_1.default(this.process, this.console, this.collections, this.clusterTestingConfiguration, cliHelper, new cluster_snapshot_cli_helper_1.default(this.process, this.console, cliHelper, this.clusters, this.clusterTesting), this.clusters, this.clusterTesting), new cluster_tester_cli_helper_1.default(this.process, this.console, this.uuidGenerator, this.cucumber, this.clusterTestingConfiguration, cliHelper, this.clusterTesting, this.frameworkConfig, this.path, this.fileSystem, this.rest, this.clusters, this.promiseFactory), this.testPortal, cliHelper);
    };
    return Cli;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Cli;
//# sourceMappingURL=cli.js.map
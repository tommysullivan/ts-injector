import CliExecutor from "./cli-executor";
import IProcess from "../node-js-wrappers/i-process";
import IConsole from "../node-js-wrappers/i-console";
import CucumberCliHelper from "./cucumber-cli-helper";
import ClusterCliHelper from "./cluster-cli-helper";
import ClusterTesterCliHelper from "./cluster-tester-cli-helper";
import CliHelper from "./cli-helper";
import ClusterSnapshotCliHelper from "./cluster-snapshot-cli-helper";
import ICollections from "../collections/i-collections";
import ClusterTestingConfiguration from "../cluster-testing/cluster-testing-configuration";
import IUUIDGenerator from "../uuid/i-uuid-generator";
import Clusters from "../clusters/clusters";
import ClusterTesting from "../cluster-testing/cluster-testing";
import FrameworkConfiguration from "../framework/framework-configuration";
import TestPortal from "../test-portal/test-portal";
import IPath from "../node-js-wrappers/i-path";
import CliConfig from "./cli-config";
import IFileSystem from "../node-js-wrappers/i-filesystem";
import Rest from "../rest/rest";
import IPromiseFactory from "../promise/i-promise-factory";
import ICucumber from "../cucumber/i-cucumber";

export default class Cli {
    private process:IProcess;
    private console:IConsole;
    private collections:ICollections;
    private clusterTestingConfiguration:ClusterTestingConfiguration;
    private uuidGenerator:IUUIDGenerator;
    private cucumber:ICucumber;
    private clusters:Clusters;
    private clusterTesting:ClusterTesting;
    private frameworkConfig:FrameworkConfiguration;
    private testPortal:TestPortal;
    private path:IPath;
    private cliConfig:CliConfig;
    private fileSystem:IFileSystem;
    private rest:Rest;
    private promiseFactory:IPromiseFactory;

    constructor(process:IProcess, console:IConsole, collections:ICollections, clusterTestingConfiguration:ClusterTestingConfiguration, uuidGenerator:IUUIDGenerator, cucumber:ICucumber, clusters:Clusters, clusterTesting:ClusterTesting, frameworkConfig:FrameworkConfiguration, testPortal:TestPortal, path:IPath, cliConfig:CliConfig, fileSystem:IFileSystem, rest:Rest, promiseFactory:IPromiseFactory) {
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

    newExecutor():CliExecutor {
        var cliHelper = new CliHelper(this.process, this.console, this.clusterTesting, this.clusters);
        return new CliExecutor(
            this.process,
            this.console,
            new CucumberCliHelper(this.console, this.cucumber, this.process, this.cliConfig.temporaryTestRunOutputFilePath),
            new ClusterCliHelper(
                this.process,
                this.console,
                this.collections,
                this.clusterTestingConfiguration,
                cliHelper,
                new ClusterSnapshotCliHelper(
                    this.process,
                    this.console,
                    cliHelper,
                    this.clusters,
                    this.clusterTesting
                ),
                this.clusters,
                this.clusterTesting
            ),
            new ClusterTesterCliHelper(
                this.process,
                this.console,
                this.uuidGenerator,
                this.cucumber,
                this.clusterTestingConfiguration,
                cliHelper,
                this.clusterTesting,
                this.frameworkConfig,
                this.path,
                this.fileSystem,
                this.rest,
                this.clusters,
                this.promiseFactory,
                this.collections
            ),
            this.testPortal,
            cliHelper
        );
    }
}
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
import Clusters from "../clusters/clusters";
import ClusterTesting from "../cluster-testing/cluster-testing";
import CliConfig from "./cli-config";
import IPromiseFactory from "../promise/i-promise-factory";
import ICucumber from "../cucumber/i-cucumber";

export default class Cli {

    constructor(
        private process:IProcess,
        private console:IConsole,
        private collections:ICollections,
        private clusterTestingConfiguration:ClusterTestingConfiguration,
        private cucumber:ICucumber,
        private clusters:Clusters,
        private clusterTesting:ClusterTesting,
        private cliConfig:CliConfig,
        private promiseFactory:IPromiseFactory
    ) {}

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
                this.cucumber,
                this.clusterTestingConfiguration,
                this.clusterTesting,
                this.clusters,
                this.promiseFactory,
                this.collections,
                this.clusterTesting.newMultiClusterTester(),
                cliHelper
            ),
            cliHelper
        );
    }
}
import {CliExecutor} from "./cli-executor";
import {IProcess} from "../node-js-wrappers/i-process";
import {IConsole} from "../node-js-wrappers/i-console";
import {CucumberCliHelper} from "./cucumber-cli-helper";
import {ClusterCliHelper} from "./cluster-cli-helper";
import {ClusterTesterCliHelper} from "./cluster-tester-cli-helper";
import {CliHelper} from "./cli-helper";
import {ClusterSnapshotCliHelper} from "./cluster-snapshot-cli-helper";
import {ICollections} from "../collections/i-collections";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {ICucumber} from "../cucumber/i-cucumber";
import {IList} from "../collections/i-list";
import {ICliConfig} from "./i-cli-config";
import {IClusters} from "../clusters/i-clusters";
import {IClusterTesting} from "../cluster-testing/i-cluster-testing";
import {ClusterCliGenerator} from "./cluster-generator-cli-helper";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";

export class Cli {

    constructor(
        private process:IProcess,
        private console:IConsole,
        private collections:ICollections,
        private clusterIds:() => IList<string>,
        private cucumber:ICucumber,
        private clusters:IClusters,
        private clusterTesting:IClusterTesting,
        private cliConfig:ICliConfig,
        private promiseFactory:IPromiseFactory,
        private fileSystem:IFileSystem
    ) {}

    newCliHelper():CliHelper {
        return new CliHelper(
            this.process,
            this.console
        );
    }

    newCucumberCliHelper():CucumberCliHelper {
        return new CucumberCliHelper(
            this.console,
            this.cucumber,
            this.process,
            () => this.cliConfig.temporaryTestRunOutputFilePath
        );
    }

    newClusterCliHelper():ClusterCliHelper {
        return new ClusterCliHelper(
            this.console,
            this.collections,
            this.newCliHelper(),
            this.clusters,
            this.clusterTesting
        )
    }

    newClusterTesterCliHelper():ClusterTesterCliHelper {
        return new ClusterTesterCliHelper(
            this.process,
            this.console,
            this.cucumber,
            this.clusterIds,
            this.clusterTesting,
            this.clusters,
            this.promiseFactory,
            this.collections,
            this.clusterTesting.newMultiClusterTester(),
            this.newCliHelper()
        )
    }

    newClusterSnapshotCliHelper():ClusterSnapshotCliHelper {
        return new ClusterSnapshotCliHelper(
            this.console,
            this.newCliHelper(),
            this.clusters,
            this.clusterTesting,
            this.collections
        );
    }

    newClusterGeneratorCliHelper():ClusterCliGenerator {
        return new ClusterCliGenerator(
            this.console,
            this.fileSystem
        );
    }

    newExecutor():CliExecutor {
        return new CliExecutor(
            this.newCucumberCliHelper(),
            this.newClusterCliHelper(),
            this.newClusterTesterCliHelper(),
            this.newClusterSnapshotCliHelper(),
            this.newClusterGeneratorCliHelper()
        );
    }
}
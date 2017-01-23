import {CliExecutor} from "./cli-executor";
import {IProcess} from "../node-js-wrappers/i-process";
import {IConsole} from "../console/i-console";
import {CucumberCliHelper} from "./cucumber-cli-helper";
import {ClusterCliHelper} from "./cluster-cli-helper";
import {ClusterTesterCliHelper} from "./cluster-tester-cli-helper";
import {CliHelper} from "./cli-helper";
import {ClusterSnapshotCliHelper} from "./cluster-snapshot-cli-helper";
import {ICollections} from "../collections/i-collections";
import {ICucumber} from "../cucumber/i-cucumber";
import {IList} from "../collections/i-list";
import {ICliConfig} from "./i-cli-config";
import {IClusters} from "../clusters/i-clusters";
import {IClusterTesting} from "../cluster-testing/i-cluster-testing";
import {ClusterCliGenerator} from "./cluster-generator-cli-helper";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {IClusterTestingConfiguration} from "../cluster-testing/i-cluster-testing-configuration";
import {IUUIDGenerator} from "../uuid/i-uuid-generator";
import {ITesting} from "../testing/i-testing";
import {IJSONSerializer} from "../typed-json/i-json-serializer";
import {IURLCalculator} from "../testing/i-url-calculator";
import {IFutures} from "../futures/i-futures";
import {IDockerCliHelper} from "./i-docker-cli-helper";
import {DockerCliHelper} from "./dockerCliHelper";
import {IDockerLauncher} from "../docker/i-docker-launcher";

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
        private futures:IFutures,
        private fileSystem:IFileSystem,
        private clusterTestingConfiguration:IClusterTestingConfiguration,
        private uuidGenerator:IUUIDGenerator,
        private testing:ITesting,
        private jsonSerializer:IJSONSerializer,
        private urlCalculator:IURLCalculator,
        private dockerLauncher:IDockerLauncher
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
            () => this.cliConfig.temporaryTestRunOutputFilePath,
            this.uuidGenerator,
            this.newCliHelper(),
            this.testing,
            this.testing.newResultReporter(),
            this.jsonSerializer,
            this.urlCalculator
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
            this.clusters,
            this.collections,
            this.clusterTesting.newMultiClusterTester(),
            this.testing
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

    newDockerCliHelper():IDockerCliHelper {
        return new DockerCliHelper(this.dockerLauncher);
    }

    newExecutor():CliExecutor {
        return new CliExecutor(
            this.newCucumberCliHelper(),
            this.newClusterCliHelper(),
            this.newClusterTesterCliHelper(),
            this.newClusterSnapshotCliHelper(),
            this.newClusterGeneratorCliHelper(),
            this.collections,
            this.clusterTestingConfiguration,
            this.newCliHelper(),
            this.process,
            this.newDockerCliHelper()
        );
    }
}
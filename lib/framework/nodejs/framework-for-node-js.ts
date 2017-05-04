import {IESXI} from "../../esxi/i-esxi";
import {ESXI} from "../../esxi/esxi";
import {IClusters} from "../../clusters/i-clusters";
import {Clusters} from "../../clusters/clusters";
import {INodeWrapperFactory} from "../../node-js-wrappers/i-node-wrapper-factory";
import {NodeWrapperFactory} from "../../node-js-wrappers/node-wrapper-factory";
import {ConfigLoader} from "./config-loader";
import {Futures} from "../../futures/futures";
import {IFutures} from "../../futures/i-futures";
import {IClusterTesting} from "../../cluster-testing/i-cluster-testing";
import {ClusterTesting} from "../../cluster-testing/cluster-testing";
import {ITesting} from "../../testing/i-testing";
import {Testing} from "../../testing/testing";
import {Cli} from "../../cli/cli";
import {ICucumber} from "../../cucumber/i-cucumber";
import {Cucumber} from "../../cucumber/cucumber";
import {IConsole} from "../../console/i-console";
import {IProcess} from "../../node-js-wrappers/i-process";
import {IFileSystem} from "../../node-js-wrappers/i-filesystem";
import {IRest} from "../../rest/common/i-rest";
import {RestForNodeJS} from "../../rest/nodejs/rest-for-node-js";
import {ISSHAPI} from "../../ssh/i-ssh-api";
import {SSHAPI} from "../../ssh/ssh-api";
import {IFramework} from "../common/i-framework";
import {Framework} from "../common/framework";
import {Grafana} from "../../grafana/grafana";
import {IGrafana} from "../../grafana/i-grafana";
import {IMarathon} from "../../marathon/i-marathon";
import {Marathon} from "../../marathon/marathon";
import {IDocker} from "../../docker/i-docker";
import {Docker} from "../../docker/docker";

export class FrameworkForNodeJS extends Framework implements IFramework {
    constructor(
        private nativeRequire:any,
        private nativeProcess:any
    ) {
        super();
    }

    get grafana():IGrafana {
        return new Grafana(
            this.frameworkConfig.grafana,
            this.fileSystem,
            this.rest
        );
    }

    get esxi():IESXI {
        return new ESXI(
            this.sshAPI,
            this.collections,
            this.frameworkConfig.esxi
        );
    }

    get clusters():IClusters {
        return new Clusters(
            this.collections.newList(this.frameworkConfig.clusters),
            this.errors,
            this.collections,
            this.sshAPI.newSSHClient(),
            this.versioning,
            this.mcs,
            this.openTSDB,
            this.installer,
            this.elasticSearch,
            this.serviceDiscoverer,
            this.esxi,
            this.packaging,
            this.operatingSystems,
            this.fileSystem,
            this.collections.newList(this.frameworkConfig.serviceGroups),
            this.futures
        );
    }

    get clusterTesting():IClusterTesting {
        return new ClusterTesting(
            this.frameworkConfig.clusterTesting,
            this.futures,
            this.collections,
            this.clusters,
            this.uuidGenerator,
            this.process,
            this.cucumber,
            this.console,
            this.frameworkConfig,
            this.typedJSON.newJSONSerializer(),
            this.testing,
            this.testing.newUrlCalculator(),
            this.docker
        );
    }

    get testing():ITesting {
        return new Testing(
            this.process,
            this.frameworkConfig,
            this.fileSystem,
            this.frameworkConfig.testing,
            this.console,
            this.typedJSON.newJSONSerializer(),
            this.collections,
            this.futures,
            this.nodeWrapperFactory.path,
            this.rest,
            this.releasing,
            this.typedJSON
        );
    }

    get cli():Cli {
        return new Cli(
            this.process,
            this.console,
            this.collections,
            () => this.collections.newList<string>(this.frameworkConfig.clusterTesting.clusterIds),
            this.cucumber,
            this.clusters,
            this.clusterTesting,
            this.frameworkConfig.cli,
            this.fileSystem,
            this.frameworkConfig.clusterTesting,
            this.uuidGenerator,
            this.testing,
            this.typedJSON.newJSONSerializer(),
            this.testing.newUrlCalculator(),
            this.docker,
            this.futures
        );
    }

    get docker():IDocker {
        return new Docker(
            this.frameworkConfig.dockerInfrastructureConfig,
            this.marathon,
            this.uuidGenerator,
            this.collections,
            this.testing,
            this.sshAPI.newSSHClient(),
            this.mcs,
            this.typedJSON,
            this.versioning,
            this.installer,
            this.openTSDB,
            this.elasticSearch,
            this.operatingSystems,
            this.packaging,
            this.futures,
            this.process
        );
    }

    get cucumber():ICucumber {
        return new Cucumber(
            this.collections,
            this.fileSystem,
            this.frameworkConfig.cucumber,
            this.errors,
            this.chai,
            this.futures,
            this.typedJSON.newJSONSerializer(),
            this.nodeWrapperFactory.path,
            this.process,
            this.console,
            this.docker,
            this.frameworkConfig.clusterTesting,
            this.clusters,
            this.testing
        );
    }

    get console():IConsole {
        return this.nodeWrapperFactory.newConsole(
            console,
            this.process.environmentVariableNamedOrDefault('logLevel', 'info')
        );
    }

    get promiseModule():any {
        return this.nativeRequire('promise');
    }

    get childProcessModule():any {
        return this.nativeRequire('child_process');
    }

    get process():IProcess { return this.nodeWrapperFactory.newProcess(this.nativeProcess); }
    get fileSystem():IFileSystem { return this.nodeWrapperFactory.fileSystem(); }

    get rest():IRest {
        return new RestForNodeJS(
            this.futures,
            this.requestModule,
            this.frameworkConfig.rest,
            this.typedJSON,
            this.collections
        );
    }

    get requestModule():any {
        return this.nativeRequire('request');
    }

    get sshAPI():ISSHAPI {
        return new SSHAPI(
            this.nodemiralModule,
            this.futures,
            this.nodeWrapperFactory,
            this.collections,
            this.frameworkConfig.ssh,
            this.uuidGenerator,
            this.nodeWrapperFactory.path,
            this.errors
        );
    }

    get nodemiralModule():any {
        return this.nativeRequire('nodemiral');
    }

    get nodeWrapperFactory():INodeWrapperFactory {
        return new NodeWrapperFactory(
            this.futures,
            this.childProcessModule,
            this.collections,
            this.fsModule,
            this.typedJSON,
            this.errors,
            this.pathModule,
            this.readLineSyncModule,
            this.mkdirpModule
        );
    }

    get mkdirpModule():any {
        return this.nativeRequire('mkdirp');
    }

    get fsModule():any {
        return this.nativeRequire('fs');
    }

    get readLineSyncModule():any {
        return this.nativeRequire('readline-sync');
    }

    get pathModule():any {
        return this.nativeRequire('path');
    }

    get frameworkConfigLoader():ConfigLoader {
        return new ConfigLoader(
            this.process,
            this.fileSystem,
            this.nodeWrapperFactory.path,
            this.collections,
            this.typedJSON,
            this.typedJSON.newJSONMerger(),
            this.typedJSON.jsonParser
        );
    }

    get futures():IFutures {
        return new Futures(this.promiseModule, this.collections);
    }

    get marathon(): IMarathon {
        return new Marathon(
            this.rest,
            this.typedJSON,
            this.collections
        );
    }
}
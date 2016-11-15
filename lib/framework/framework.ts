import {IClusterUnderTest} from "../cluster-testing/i-cluster-under-test";
import {IFuture} from "../promise/i-future";
import {Clusters} from "../clusters/clusters";
import {Cucumber} from "../cucumber/cucumber";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {ICollections} from "../collections/i-collections";
import {IProcess} from "../node-js-wrappers/i-process";
import {ClusterTesting} from "../cluster-testing/cluster-testing";
import {Cli} from "../cli/cli";
import {IList} from "../collections/i-list";
import {INodeWrapperFactory} from "../node-js-wrappers/i-node-wrapper-factory";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IErrors} from "../errors/i-errors";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {OpenTSDB} from "../open-tsdb/open-tsdb";
import {ESXI} from "../esxi/esxi";
import {ElasticSearch} from "../elasticsearch/elasticsearch";
import {MCS} from "../mcs/mcs";
import {Installer} from "../installer/installer";
import {ISSHAPI} from "../ssh/i-ssh-api";
import {IUUIDGenerator} from "../uuid/i-uuid-generator";
import {ServiceDiscoverer} from "../cluster-testing/service-discoverer";
import {Versioning} from "../versioning/versioning";
import {IVersioning} from "../versioning/i-versioning";
import {IConsole} from "../node-js-wrappers/i-console";
import {IOperatingSystems} from "../operating-systems/i-operating-systems";
import {OperatingSystems} from "../operating-systems/operating-systems";
import {IPackaging} from "../packaging/i-packaging";
import {Packaging} from "../packaging/packaging";
import {Grafana} from "../grafana/grafana";
import {ICucumber} from "../cucumber/i-cucumber";
import {Releasing} from "../releasing/releasing";
import {IReleasing} from "../releasing/i-releasing";
import {ChaiStatic} from "../chai/chai-static";
import {Assertion} from "../chai/assertion";
import {IFrameworkConfiguration} from "./i-framework-configuration";
import {IOpenTSDB} from "../open-tsdb/i-open-tsdb";
import {IESXI} from "../esxi/i-esxi";
import {IClusters} from "../clusters/i-clusters";
import {IGrafana} from "../grafana/i-grafana";
import {IServiceDiscoverer} from "../cluster-testing/i-service-discoverer";
import {IMCS} from "../mcs/i-mcs";
import {IInstaller} from "../installer/i-installer";
import {IElasticsearch} from "../elasticsearch/i-elasticsearch";
import {IClusterTesting} from "../cluster-testing/i-cluster-testing";
import {IFramework} from "./i-framework";
import {IRest} from "../rest/i-rest";
import {IExpectationWrapper} from "../chai/i-expectation-wrapper";
import {ITesting} from "../testing/i-testing";
import {Testing} from "../testing/testing";

export class Framework implements IFramework {
    constructor(
        public frameworkConfig:IFrameworkConfiguration,
        public process:IProcess,
        public fileSystem:IFileSystem,
        public uuidGenerator:IUUIDGenerator,
        public collections:ICollections,
        public errors:IErrors,
        public promiseFactory:IPromiseFactory,
        public typedJSON:ITypedJSON,
        public sshAPI:ISSHAPI,
        public nodeWrapperFactory:INodeWrapperFactory,
        public chai:ChaiStatic,
        public console:IConsole,
        public rest:IRest,
        private _testRunGUID:string
    ) {}
    
    get testRunGUID():string {
        return this._testRunGUID;
    }

    get packaging():IPackaging {
        return new Packaging(
            this.frameworkConfig.packaging,
            this.collections
        );
    }

    get openTSDB():IOpenTSDB {
        return new OpenTSDB(
            this.rest,
            this.frameworkConfig.openTSDB,
            this.collections,
            this.typedJSON
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
            this.esxi,
            this.operatingSystems
        );
    }
    get operatingSystems():IOperatingSystems {
        return new OperatingSystems();
    }

    get versioning():IVersioning { return new Versioning(); }

    get releasing():IReleasing {
        return new Releasing(
            this.packaging,
            this.frameworkConfig.releasing,
            this.collections
        );
    }

    get grafana():IGrafana {
        return new Grafana(
            this.frameworkConfig.grafana,
            this.fileSystem,
            this.rest
        );
    }

    get serviceDiscoverer():IServiceDiscoverer {
        return new ServiceDiscoverer(this.versioning, this.promiseFactory, this.errors);
    }

    get elasticSearch():IElasticsearch {
        return new ElasticSearch(this.rest, this.frameworkConfig.elasticsearch);
    }

    get mcs():IMCS {
        return new MCS(
            this.frameworkConfig.mcs,
            this.rest,
            this.typedJSON,
            this.errors
        )
    }

    get installer():IInstaller {
        return new Installer(
            this.frameworkConfig.installerClient,
            this.rest,
            this.promiseFactory,
            this.typedJSON
        );
    }

    get clusterTesting():IClusterTesting {
        return new ClusterTesting(
            this.frameworkConfig.clusterTesting,
            this.promiseFactory,
            this.sshAPI.newSSHClient(),
            this.collections,
            this.versioning,
            this.mcs,
            this.openTSDB,
            this.installer,
            this.elasticSearch,
            this.serviceDiscoverer,
            this.esxi,
            this.clusters,
            this.packaging,
            this.uuidGenerator,
            this.process,
            this.cucumber,
            this.console,
            this.frameworkConfig,
            this.typedJSON.newJSONSerializer(),
            this.operatingSystems,
            this.testing
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
            this.promiseFactory,
            this.nodeWrapperFactory.path,
            this.rest,
            this.releasing
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
            this.promiseFactory,
            this.fileSystem,
            this.frameworkConfig.clusterTesting,
            this.uuidGenerator,
            this.testing,
            this.typedJSON.newJSONSerializer()
        );
    }

    get cucumber():ICucumber {
        return new Cucumber(
            this.collections,
            this.fileSystem,
            this.frameworkConfig.cucumber,
            this.errors,
            this.chai,
            this.promiseFactory,
            this.typedJSON.newJSONSerializer(),
            this.nodeWrapperFactory.path,
            this.process,
            this.console
        );
    }

    get clusterUnderTest():IClusterUnderTest {
        const clusterConfig = this.clusters.clusterConfigurationWithId(
            this.process.environmentVariableNamed('clusterId')
        );
        return this.clusterTesting.newClusterUnderTest(clusterConfig);
    }

    private get expectationWrapper():IExpectationWrapper {
        return this.cucumber.newExpectationWrapper();
    }

    expect(target:any, message?:string):Assertion {
        return this.expectationWrapper.expect(target, message);
    }

    expectAll<T>(target:IList<IFuture<T>>):Assertion {
        return this.expectationWrapper.expectAll(target);
    }

    expectEmptyList<T>(list:IList<T>):void {
        return this.expectationWrapper.expectEmptyList(list);
    }
}
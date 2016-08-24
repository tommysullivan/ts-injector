import IClusterUnderTest from "../cluster-testing/i-cluster-under-test";
import IThenable from "../promise/i-thenable";
import Clusters from "../clusters/clusters";
import Cucumber from "../cucumber/cucumber";
import IPromiseFactory from "../promise/i-promise-factory";
import Rest from "../rest/rest";
import ICollections from "../collections/i-collections";
import IProcess from "../node-js-wrappers/i-process";
import ClusterTesting from "../cluster-testing/cluster-testing";
import Cli from "../cli/cli";
import IList from "../collections/i-list";
import INodeWrapperFactory from "../node-js-wrappers/i-node-wrapper-factory";
import FrameworkConfiguration from "./framework-configuration";
import ITypedJSON from "../typed-json/i-typed-json";
import IErrors from "../errors/i-errors";
import IFileSystem from "../node-js-wrappers/i-filesystem";
import OpenTSDB from "../open-tsdb/open-tsdb";
import ESXI from "../esxi/esxi";
import ElasticSearch from "../elasticsearch/elasticsearch";
import MCS from "../mcs/mcs";
import Installer from "../installer/installer";
import ISSHAPI from "../ssh/i-ssh-api";
import IUUIDGenerator from "../uuid/i-uuid-generator";
import ServiceDiscoverer from "../cluster-testing/service-discoverer";
import Versioning from "../versioning/versioning";
import IVersioning from "../versioning/i-versioning";
import IConsole from "../node-js-wrappers/i-console";
import ExpressWrappers from "../express-wrappers/express-wrappers";
import Jira from "../jira/jira";
import IOperatingSystems from "../operating-systems/i-operating-systems";
import OperatingSystems from "../operating-systems/operating-systems";
import IPackaging from "../packaging/i-packaging";
import Packaging from "../packaging/packaging";
import Grafana from "../grafana/grafana";
import ICucumber from "../cucumber/i-cucumber";
import Releasing from "../releasing/releasing";
import IReleasing from "../releasing/i-releasing";
import {ChaiStatic} from "../chai/chai-static";
import {Assertion} from "../chai/assertion";

export default class Framework {
    constructor(
        public frameworkConfig:FrameworkConfiguration,
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
        public rest:Rest,
        public expressWrappers:ExpressWrappers,
        private _testRunGUID:string
    ) {}
    
    get jira():Jira {
        return new Jira(this.frameworkConfig.jiraConfig, this.rest);
    }

    get testRunGUID():string {
        return this._testRunGUID;
    }

    get packaging():IPackaging {
        return new Packaging(
            this.typedJSON,
            this.frameworkConfig.packagingConfigJSON,
            this.collections
        );
    }

    get openTSDB():OpenTSDB { return new OpenTSDB(this.rest, this.frameworkConfig.openTSDBConfig, this.collections, this.typedJSON); }
    get esxi():ESXI { return new ESXI(this.sshAPI, this.collections, this.frameworkConfig.esxiConfiguration); }
    get clusters():Clusters { return new Clusters(this.frameworkConfig.clustersConfig, this.esxi, this.errors, this.operatingSystems); }
    get operatingSystems():IOperatingSystems { return new OperatingSystems(this.packaging); }
    get versioning():IVersioning { return new Versioning(); }
    get releasing():IReleasing { return new Releasing(this.packaging, this.frameworkConfig.releasingConfig); }

    get grafana():Grafana {
        return new Grafana(
            this.frameworkConfig.grafanaConfig,
            this.fileSystem,
            this.rest
        );
    }

    get serviceDiscoverer():ServiceDiscoverer {
        return new ServiceDiscoverer(this.versioning, this.promiseFactory, this.errors);
    }

    get elasticSearch():ElasticSearch {
        return new ElasticSearch(this.rest, this.frameworkConfig.elasticSearchConfiguration);
    }

    get mcs():MCS {
        return new MCS(
            this.frameworkConfig.mcs,
            this.rest,
            this.typedJSON,
            this.errors
        )
    }

    get installer():Installer {
        return new Installer(
            this.frameworkConfig.installerClient,
            this.rest,
            this.promiseFactory,
            this.collections,
            this.typedJSON
        );
    }

    get clusterTesting():ClusterTesting {
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
            this.releasing,
            this.uuidGenerator,
            this.process,
            this.cucumber,
            this.console,
            this.frameworkConfig,
            this.fileSystem,
            this.rest,
            this.nodeWrapperFactory.path
        );
    }

    get cli():Cli {
        return new Cli(
            this.process,
            this.console,
            this.collections,
            this.frameworkConfig.clusterTesting,
            this.cucumber,
            this.clusters,
            this.clusterTesting,
            this.frameworkConfig.cliConfig,
            this.promiseFactory
        );
    }

    get cucumber():ICucumber {
        return new Cucumber(
            this.collections,
            this.fileSystem,
            this.frameworkConfig.cucumber,
            this.errors
        );
    }

    get clusterUnderTest():IClusterUnderTest {
        const clusterConfig = this.clusters.clusterConfigurationWithId(
            this.process.environmentVariableNamed('clusterId')
        );
        return this.clusterTesting.newClusterUnderTest(clusterConfig);
    }
    
    expect(target: any, message?: string):Assertion {
        if(typeof(target['then'])=='function') {
            const targetAsPromise:IThenable<any> = target;
            const targetWithErrorMessageHelper = targetAsPromise
                .catch(error=>{
                    if(this.frameworkConfig.cucumber.embedAsyncErrorsInStepOutput)
                        console.log(error.toJSON ? error.toJSON() : error.toString());
                    throw error.toString();
                });
            return this.chai.expect(targetWithErrorMessageHelper);
        } else return this.chai.expect(target, message);
    }

    expectAll<T>(target:IList<IThenable<T>>):Assertion {
        return this.expect(this.promiseFactory.newGroupPromise(target));
    }

    expectEmptyList<T>(list:IList<T>):void {
        if(list.notEmpty())
            throw new Error(`expected empty list, got ${list.toJSONString()}`);
    }
}
import Assertion = Chai.Assertion;
import ChaiStatic = Chai.ChaiStatic;

import IClusterUnderTest from "../cluster-testing/i-cluster-under-test";
import IThenable from "../promise/i-thenable";
import Clusters from "../clusters/clusters";
import SpyglassHealthChecker from "../spyglass/spyglass-health-checker";
import Spyglass from "../spyglass/spyglass";
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
import TestPortal from "../test-portal/test-portal";
import ExpressWrappers from "../express-wrappers/express-wrappers";
import Jira from "../jira/jira";

export default class Framework {
    public frameworkConfig:FrameworkConfiguration;
    public process:IProcess;
    public fileSystem:IFileSystem;
    public uuidGenerator:IUUIDGenerator;
    public collections:ICollections;
    public errors:IErrors;
    public promiseFactory:IPromiseFactory;
    public typedJSON:ITypedJSON;
    public sshAPI:ISSHAPI;
    public nodeWrapperFactory:INodeWrapperFactory;
    public chai:ChaiStatic;
    public console:IConsole;
    public rest:Rest;
    public expressWrappers:ExpressWrappers;
    private _testRunGUID:string;

    constructor(frameworkConfig:FrameworkConfiguration, process:IProcess, fileSystem:IFileSystem, uuidGenerator:IUUIDGenerator, collections:ICollections, errors:IErrors, promiseFactory:IPromiseFactory, typedJSON:ITypedJSON, sshAPI:ISSHAPI, nodeWrapperFactory:INodeWrapperFactory, chai:Chai.ChaiStatic, console:IConsole, rest:Rest, expressWrappers:ExpressWrappers) {
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

    get testPortal():TestPortal {
        return new TestPortal(
            this.frameworkConfig.testPortalConfig,
            this.expressWrappers,
            this.nodeWrapperFactory,
            this.jira,
            this.process,
            this.promiseFactory,
            this.collections,
            this.console
        );
    }
    
    get jira():Jira {
        return new Jira(this.frameworkConfig.jiraConfig, this.rest);
    }

    get testRunGUID():string {
        return this._testRunGUID;
    }

    get openTSDB():OpenTSDB { return new OpenTSDB(this.rest, this.frameworkConfig.openTSDBConfig); }
    get spyglass():Spyglass { return new Spyglass(this.frameworkConfig.spyglassConfig, this.errors); }
    get esxi():ESXI { return new ESXI(this.sshAPI, this.collections, this.frameworkConfig.esxiConfiguration); }
    get clusters():Clusters { return new Clusters(this.frameworkConfig.clustersConfig, this.esxi, this.errors, this.collections); }
    get versioning():IVersioning { return new Versioning(this.frameworkConfig.versioningConfig); }

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
            this.clusters
        );
    }

    get cli():Cli {
        return new Cli(
            this.process,
            this.console,
            this.collections,
            this.frameworkConfig.clusterTesting,
            this.uuidGenerator,
            this.cucumber,
            this.clusters,
            this.clusterTesting,
            this.frameworkConfig,
            this.testPortal,
            this.nodeWrapperFactory.path,
            this.frameworkConfig.cliConfig,
            this.fileSystem,
            this.rest,
            this.promiseFactory
        );
    }

    get cucumber():Cucumber {
        return new Cucumber(
            this.collections,
            this.fileSystem,
            this.frameworkConfig.cucumber,
            this.errors
        );
    }

    get clusterUnderTest():IClusterUnderTest {
        var clusterConfig = this.clusters.clusterConfigurationWithId(
            this.process.environmentVariableNamed('clusterId')
        );
        return this.clusterTesting.newClusterUnderTest(clusterConfig);
    }
    
    get spyglassHealthChecker():SpyglassHealthChecker {
        return this.spyglass.newSpyglassHealthChecker();
    }

    expect(target: any, message?: string):Assertion {
        if(typeof(target['then'])=='function') {
            var targetAsPromise:IThenable<any> = target;
            var targetWithErrorMessageHelper = targetAsPromise
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

    assertEmptyList<T>(list:IList<T>):void {
        if(list.notEmpty())
            throw new this.chai.AssertionError(`expected empty list, got ${list.toJSONString()}`);
    }
}
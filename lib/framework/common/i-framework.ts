import {IList} from "../../collections/i-list";
import {Assertion} from "../../chai/assertion";
import {ICluster} from "../../clusters/i-cluster";
import {ICucumber} from "../../cucumber/i-cucumber";
import {Cli} from "../../cli/cli";
import {IClusterTesting} from "../../cluster-testing/i-cluster-testing";
import {IInstaller} from "../../installer/i-installer";
import {IMCS} from "../../mcs/i-mcs";
import {IElasticsearch} from "../../elasticsearch/i-elasticsearch";
import {IServiceDiscoverer} from "../../clusters/i-service-discoverer";
import {IGrafana} from "../../grafana/i-grafana";
import {IReleasing} from "../../releasing/i-releasing";
import {IVersioning} from "../../versioning/i-versioning";
import {IOperatingSystems} from "../../operating-systems/i-operating-systems";
import {IClusters} from "../../clusters/i-clusters";
import {IESXI} from "../../esxi/i-esxi";
import {IOpenTSDB} from "../../open-tsdb/i-open-tsdb";
import {IPackaging} from "../../packaging/i-packaging";
import {IRest} from "../../rest/common/i-rest";
import {IConsole} from "../../console/i-console";
import {INodeWrapperFactory} from "../../node-js-wrappers/i-node-wrapper-factory";
import {ISSHAPI} from "../../ssh/i-ssh-api";
import {ITypedJSON} from "../../typed-json/i-typed-json";
import {IErrors} from "../../errors/i-errors";
import {ICollections} from "../../collections/i-collections";
import {IUUIDGenerator} from "../../uuid/i-uuid-generator";
import {IFileSystem} from "../../node-js-wrappers/i-filesystem";
import {IProcess} from "../../node-js-wrappers/i-process";
import {IFrameworkConfiguration} from "./i-framework-configuration";
import {ChaiStatic} from "../../chai/chai-static";
import {IFutures} from "../../futures/i-futures";
import {IFuture} from "../../futures/i-future";
import {ITesting} from "../../testing/i-testing";

export interface IFramework {
    frameworkConfig:IFrameworkConfiguration;
    uuidGenerator:IUUIDGenerator;
    collections:ICollections;
    errors:IErrors;
    futures:IFutures;
    typedJSON:ITypedJSON;
    chai:ChaiStatic;
    console:IConsole;
    rest:IRest;
    testRunGUID:string;
    packaging:IPackaging;
    openTSDB:IOpenTSDB;
    operatingSystems:IOperatingSystems;
    versioning:IVersioning;
    releasing:IReleasing;
    grafana:IGrafana;
    serviceDiscoverer:IServiceDiscoverer;
    elasticSearch:IElasticsearch;
    mcs:IMCS;
    installer:IInstaller;
    expect(target: any, message?: string):Assertion;
    expectAll<T>(target:IList<IFuture<T>>):Assertion;
    expectEmptyList<T>(list:IList<T>):void;
    testing:ITesting;

    //TODO: In order of "most likely to stay server side" to "most needed client side so split deps"
    nodeWrapperFactory:INodeWrapperFactory;
    process:IProcess;
    fileSystem:IFileSystem;
    sshAPI:ISSHAPI;
    cli:Cli;
    esxi:IESXI;
    clusterTesting:IClusterTesting;
    cucumber:ICucumber;
    clusters:IClusters;

    //TODO: Can this be private? nodeWrapperFactory:INodeWrapperFactory;
    //TODO: eliminate these particular instances from IFrameworkForNodeJS
    clusterUnderTest:ICluster;
    clusterId:string;
}
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
import {ITesting} from "../../testing/i-testing";
import {IMarathon} from "../../marathon/i-marathon";
import {IClusterLoaderForMesosEnvironment} from "../../clusters/i-mesos-cluster-loader";
import {IDocker} from "../../docker/i-docker";

export interface IFramework {
    //TODO: Remove
    frameworkConfig:IFrameworkConfiguration;
    testRunGUID:string;

    uuidGenerator:IUUIDGenerator;
    collections:ICollections;
    errors:IErrors;
    futures:IFutures;
    typedJSON:ITypedJSON;
    chai:ChaiStatic;
    console:IConsole;
    rest:IRest;
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
    testing:ITesting;
    marathon:IMarathon;
    nodeWrapperFactory:INodeWrapperFactory;
    process:IProcess;
    fileSystem:IFileSystem;
    sshAPI:ISSHAPI;
    cli:Cli;
    esxi:IESXI;
    clusterTesting:IClusterTesting;
    cucumber:ICucumber;
    clusters:IClusters;
    docker:IDocker;
}
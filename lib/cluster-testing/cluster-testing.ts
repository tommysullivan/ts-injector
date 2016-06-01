import IClusterConfiguration from "../clusters/i-cluster-configuration";
import IClusterUnderTest from "./i-cluster-under-test";
import ClusterUnderTest from "./cluster-under-test";
import ClusterTestingConfiguration from "./cluster-testing-configuration";
import IPromiseFactory from "../promise/i-promise-factory";
import INodeConfiguration from "../nodes/i-node-configuration";
import INodeUnderTest from "./i-node-under-test";
import NodeUnderTest from "./node-under-test";
import ISSHClient from "../ssh/i-ssh-client";
import ICollections from "../collections/i-collections";
import Versioning from "../versioning/versioning";
import MCS from "../mcs/mcs";
import OpenTSDB from "../open-tsdb/open-tsdb";
import Installer from "../installer/installer";
import ElasticSearch from "../elasticsearch/elasticsearch";
import ServiceDiscoverer from "./service-discoverer";
import ESXIManagedCluster from "./esxi-managed-cluster";
import IESXI from "../esxi/i-esxi";
import Clusters from "../clusters/clusters";
import ClusterInstaller from "./cluster-installer";
import ClusterTestResult from "./cluster-test-result";
import ICucumberRunConfiguration from "../cucumber/i-cucumber-run-configuration";
import ICucumberTestResult from "../cucumber/i-cucumber-test-result";
import FrameworkConfiguration from "../framework/framework-configuration";
import IClusterVersionGraph from "../versioning/i-cluster-version-graph";
import IVersioning from "../versioning/i-versioning";
import INodeRepoURLProvider from "./i-node-repo-url-provider";
import NodeRepoUrlProvider from "./node-repo-url-provider";
import IRepositories from "../repositories/i-repositories";

export default class ClusterTesting {
    private clusterTestingConfiguration:ClusterTestingConfiguration;
    private promiseFactory:IPromiseFactory;
    private sshClient:ISSHClient;
    private collections:ICollections;
    private versioning:IVersioning;
    private mcs:MCS;
    private openTSDB:OpenTSDB;
    private installer:Installer;
    private elasticSearch:ElasticSearch;
    private serviceDiscoverer:ServiceDiscoverer;
    private esxi:IESXI;
    private clusters:Clusters;
    private repositories:IRepositories;

    constructor(clusterTestingConfiguration:ClusterTestingConfiguration, promiseFactory:IPromiseFactory, sshClient:ISSHClient, collections:ICollections, versioning:IVersioning, mcs:MCS, openTSDB:OpenTSDB, installer:Installer, elasticSearch:ElasticSearch, serviceDiscoverer:ServiceDiscoverer, esxi:IESXI, clusters:Clusters, repositories:IRepositories) {
        this.clusterTestingConfiguration = clusterTestingConfiguration;
        this.promiseFactory = promiseFactory;
        this.sshClient = sshClient;
        this.collections = collections;
        this.versioning = versioning;
        this.mcs = mcs;
        this.openTSDB = openTSDB;
        this.installer = installer;
        this.elasticSearch = elasticSearch;
        this.serviceDiscoverer = serviceDiscoverer;
        this.esxi = esxi;
        this.clusters = clusters;
        this.repositories = repositories;
    }

    esxiManagedClusterForId(clusterId:string):ESXIManagedCluster {
        return this.newESXIManagedCluster(
            this.clusters.clusterConfigurationWithId(clusterId)
        );
    }

    newClusterUnderTest(clusterConfiguration:IClusterConfiguration):IClusterUnderTest {
        return new ClusterUnderTest(
            this.clusterTestingConfiguration.clusterInstallerConfiguration,
            this.promiseFactory,
            clusterConfiguration.nodes.map(n=>this.newNodeUnderTest(n)),
            this.versioning,
            clusterConfiguration,
            this.serviceDiscoverer,
            this,
            this.newClusterInstaller()
        );
    }
    
    newClusterInstaller() {
        return new ClusterInstaller(
            this.promiseFactory,
            this.versioning.serviceSet(),
            this.clusterTestingConfiguration.clusterInstallerConfiguration
        );
    }

    newNodeUnderTest(nodeConfiguration:INodeConfiguration):INodeUnderTest {
        return new NodeUnderTest(
            nodeConfiguration,
            this.sshClient,
            this.promiseFactory,
            this.collections,
            this.mcs,
            this.openTSDB,
            this.installer,
            this.elasticSearch,
            this.versioning,
            this.newNodeRepoUrlProvider()
        );
    }

    newNodeRepoUrlProvider():INodeRepoURLProvider {
        return new NodeRepoUrlProvider(
            this.repositories.newRepositoryUrlProvider(),
            this.clusterTestingConfiguration.phaseOfDevelopment,
            this.clusterTestingConfiguration.maprCoreVersion
        );
    }

    newESXIManagedCluster(clusterConfiguration:IClusterConfiguration):ESXIManagedCluster {
        return new ESXIManagedCluster(
            clusterConfiguration,
            this.esxi,
            this.promiseFactory
        );
    }

    newClusterTestResult(cucumberRunConfig:ICucumberRunConfiguration, cucumberTestResult:ICucumberTestResult, frameworkConfiguration:FrameworkConfiguration, versionGraph:IClusterVersionGraph, versionGraphError:string, clusterConfiguration:IClusterConfiguration):ClusterTestResult {
        return new ClusterTestResult(
            cucumberRunConfig,
            cucumberTestResult,
            frameworkConfiguration,
            versionGraph,
            versionGraphError,
            clusterConfiguration
        );
    }
}
import RestConfiguration from "../rest/rest-configuration";
import MCSConfiguration from "../mcs/mcs-configuration";
import InstallerClientConfiguration from "../installer/installer-client-configuration";
import ClusterTestingConfiguration from "../cluster-testing/cluster-testing-configuration";
import CucumberConfiguration from "../cucumber/cucumber-configuration";
import SSHConfiguration from "../ssh/ssh-configuration";
import OpenTSDBConfig from "../open-tsdb/open-tsdb-config";
import ElasticSearchConfiguration from "../elasticsearch/elasticsearch-configuration";
import IJSONObject from "../typed-json/i-json-object";
import SpyglassConfig from "../spyglass/spyglass-config";
import IList from "../collections/i-list";
import ESXIConfiguration from "../esxi/configuration/esxi-configuration";
import VersioningConfig from "../versioning/versioning-config";
import TestPortalConfiguration from "../test-portal/test-portal-configuration";
import JiraConfiguration from "../jira/jira-configuration";
import IPath from "../node-js-wrappers/i-path";
import CliConfig from "../cli/cli-config";
import IProcess from "../node-js-wrappers/i-process";

export default class FrameworkConfiguration {
    private frameworkConfigJSON:IJSONObject;
    private basePathToUseForConfiguredRelativePaths:string;
    private path:IPath;
    private process:IProcess;

    constructor(frameworkConfigJSON:IJSONObject, basePathToUseForConfiguredRelativePaths:string, path:IPath, process:IProcess) {
        this.frameworkConfigJSON = frameworkConfigJSON;
        this.basePathToUseForConfiguredRelativePaths = basePathToUseForConfiguredRelativePaths;
        this.path = path;
        this.process = process;
    }

    get rest():RestConfiguration {
        return new RestConfiguration(this.frameworkConfigJSON.jsonObjectNamed('rest'));
    }

    get cliConfig():CliConfig {
        return new CliConfig(
            this.frameworkConfigJSON.jsonObjectNamed('cli'),
            this.basePathToUseForConfiguredRelativePaths,
            this.path
        );
    }

    get testPortalConfig():TestPortalConfiguration {
        return new TestPortalConfiguration(
            this.frameworkConfigJSON.jsonObjectNamed('testPortal'),
            this.basePathToUseForConfiguredRelativePaths,
            this.path,
            this.process
        );
    }

    get jiraConfig():JiraConfiguration {
        return new JiraConfiguration(this.frameworkConfigJSON.jsonObjectNamed('jira'));
    }

    get mcs():MCSConfiguration {
        return new MCSConfiguration(this.frameworkConfigJSON.jsonObjectNamed('mcs'));
    }

    get installerClient():InstallerClientConfiguration {
        return new InstallerClientConfiguration(this.frameworkConfigJSON.jsonObjectNamed('installerClient'));
    }

    get clusterTesting():ClusterTestingConfiguration {
        return new ClusterTestingConfiguration(
            this.frameworkConfigJSON.jsonObjectNamed('clusterTesting'),
            this.basePathToUseForConfiguredRelativePaths,
            this.path,
            this.process
        );
    }

    get spyglassConfig():SpyglassConfig {
        return new SpyglassConfig(this.frameworkConfigJSON.jsonObjectNamed('spyglass'));
    }

    get cucumber():CucumberConfiguration {
        return new CucumberConfiguration(this.frameworkConfigJSON.jsonObjectNamed('cucumber'));
    }

    get ssh():SSHConfiguration {
        return new SSHConfiguration(this.frameworkConfigJSON.jsonObjectNamed('ssh'));
    }

    get openTSDBConfig():OpenTSDBConfig {
        return new OpenTSDBConfig(this.frameworkConfigJSON.jsonObjectNamed('openTSDB'));
    }

    get elasticSearchConfiguration():ElasticSearchConfiguration {
        return new ElasticSearchConfiguration(this.frameworkConfigJSON.jsonObjectNamed('elasticsearch'));
    }

    get clustersConfig():IList<IJSONObject> {
        return this.frameworkConfigJSON.listOfJSONObjectsNamed('clusters');
    }

    get versioningConfig():VersioningConfig {
        return new VersioningConfig(this.frameworkConfigJSON.jsonObjectNamed('versioning'));
    }

    get esxiConfiguration():ESXIConfiguration {
        return new ESXIConfiguration(this.frameworkConfigJSON.jsonObjectNamed('esxi'));
    }

    toJSON():any {
        return this.frameworkConfigJSON.toRawJSON();
    }
}
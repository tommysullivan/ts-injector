import {RestConfiguration} from "../../rest/common/rest-configuration";
import {MCSConfiguration} from "../../mcs/mcs-configuration";
import {InstallerClientConfiguration} from "../../installer/installer-client-configuration";
import {CucumberConfiguration} from "../../cucumber/cucumber-configuration";
import {SSHConfiguration} from "../../ssh/ssh-configuration";
import {OpenTSDBConfiguration} from "../../open-tsdb/open-tsdb-configuration";
import {ElasticSearchConfiguration} from "../../elasticsearch/elasticsearch-configuration";
import {IJSONObject} from "../../typed-json/i-json-object";
import {ESXIConfiguration} from "../../esxi/configuration/esxi-configuration";
import {IPath} from "../../node-js-wrappers/i-path";
import {CliConfig} from "../../cli/cli-config";
import {IProcess} from "../../node-js-wrappers/i-process";
import {ICollections} from "../../collections/i-collections";
import {ICliConfig} from "../../cli/i-cli-config";
import {IFrameworkConfiguration} from "./i-framework-configuration";
import {IClusterTestingConfiguration} from "../../cluster-testing/i-cluster-testing-configuration";
import {ClusterTestingConfiguration} from "../../cluster-testing/cluster-testing-configuration";
import {IReleasingConfig} from "../../releasing/i-releasing-config";
import {IPackagingConfig} from "../../packaging/i-packaging-config";
import {IRestConfiguration} from "../../rest/common/i-rest-configuration";
import {IGrafanaConfig} from "../../grafana/i-grafana-config";
import {IMCSConfiguration} from "../../mcs/i-mcs-configuration";
import {IInstallerClientConfiguration} from "../../installer/i-installer-client-configuration";
import {IOpenTSDBConfiguration} from "../../open-tsdb/i-open-tsdb-configuration";
import {ISSHConfiguration} from "../../ssh/i-ssh-configuration";
import {ICucumberConfiguration} from "../../cucumber/i-cucumber-configuration";
import {IElasticsearchConfiguration} from "../../elasticsearch/i-elasticsearch-configuration";
import {IESXIConfiguration} from "../../esxi/configuration/i-esxi-configuration";
import {GrafanaConfig} from "../../grafana/grafana-config";
import {IClusterConfiguration} from "../../clusters/i-cluster-configuration";
import {ClusterConfiguration} from "../../clusters/cluster-configuration";
import {PackagingConfig} from "../../packaging/packaging-config";
import {ReleasingConfig} from "../../releasing/releasing-config";
import {IFileSystem} from "../../node-js-wrappers/i-filesystem";
import {ITestingConfiguration} from "../../testing/i-testing-configuration";
import {TestingConfiguration} from "../../testing/testing-configuration";
import {IServiceGroupConfig} from "../../services/i-service-group-config";
import {ServiceGroupConfig} from "../../services/service-group-config";
import {IJSONValue} from "../../typed-json/i-json-value";
import {IDockerInfrastructureConfiguration} from "../../docker/i-docker-infrastructure-config";
import {DockerInfrastructureConfiguration} from "../../docker/docker-infrastructure-config";

export class FrameworkConfiguration implements IFrameworkConfiguration {
    constructor(
        private frameworkConfigJSON:IJSONObject,
        private basePathToUseForConfiguredRelativePaths:string,
        private path:IPath,
        private process:IProcess,
        private collections:ICollections,
        private fileSystem:IFileSystem
    ) {}

    get testing():ITestingConfiguration {
        return new TestingConfiguration(
            this.basePathToUseForConfiguredRelativePaths,
            this.frameworkConfigJSON.jsonObjectNamed('testing'),
            this.process,
            this.path
        );
    }

    get releasing():IReleasingConfig {
        return new ReleasingConfig(
            this.frameworkConfigJSON.jsonObjectNamed('releasing')
        );
    }

    get packaging():IPackagingConfig {
        return new PackagingConfig(
            this.frameworkConfigJSON.jsonObjectNamed('packaging')
        );
    }

    get rest():IRestConfiguration {
        return new RestConfiguration(this.frameworkConfigJSON.jsonObjectNamed('rest'));
    }

    get grafana():IGrafanaConfig {
        return new GrafanaConfig(
            this.frameworkConfigJSON.jsonObjectNamed('grafana')
        );
    }

    get cli():ICliConfig {
        return new CliConfig(
            this.frameworkConfigJSON.jsonObjectNamed('cli'),
            this.basePathToUseForConfiguredRelativePaths,
            this.path,
            this.fileSystem
        );
    }

    get mcs():IMCSConfiguration {
        return new MCSConfiguration(this.frameworkConfigJSON.jsonObjectNamed('mcs'));
    }

    get installerClient():IInstallerClientConfiguration {
        return new InstallerClientConfiguration(this.frameworkConfigJSON.jsonObjectNamed('installerClient'));
    }

    get clusterTesting():IClusterTestingConfiguration {
        return new ClusterTestingConfiguration(
            this.frameworkConfigJSON.jsonObjectNamed('clusterTesting'),
            this.process,
            this.collections
        );
    }

    get cucumber():ICucumberConfiguration {
        return new CucumberConfiguration(
            this.frameworkConfigJSON.jsonObjectNamed('cucumber'),
            this.basePathToUseForConfiguredRelativePaths,
            this.path
        );
    }

    get ssh():ISSHConfiguration {
        return new SSHConfiguration(this.frameworkConfigJSON.jsonObjectNamed('ssh'));
    }

    get openTSDB():IOpenTSDBConfiguration {
        return new OpenTSDBConfiguration(this.frameworkConfigJSON.jsonObjectNamed('openTSDB'));
    }

    get elasticsearch():IElasticsearchConfiguration {
        return new ElasticSearchConfiguration(this.frameworkConfigJSON.jsonObjectNamed('elasticsearch'));
    }

    get clusters():Array<IClusterConfiguration> {
        return this.frameworkConfigJSON.listOfJSONObjectsNamed('clusters')
            .map(clusterConfigJSON=>new ClusterConfiguration(clusterConfigJSON))
            .toArray();
    }

    get esxi():IESXIConfiguration {
        return new ESXIConfiguration(this.frameworkConfigJSON.jsonObjectNamed('esxi'));
    }

    toJSON():IJSONValue {
        return this.frameworkConfigJSON.toJSON();
    }

    get serviceGroups():Array<IServiceGroupConfig> {
        return this.frameworkConfigJSON
            .listOfJSONObjectsNamedOrDefaultToEmpty(`serviceGroups`)
            .map(serviceConfig => new ServiceGroupConfig(serviceConfig))
            .toArray();
    }

    get dockerInfrastructureConfig(): IDockerInfrastructureConfiguration {
        return new DockerInfrastructureConfiguration(this.frameworkConfigJSON.jsonObjectNamed(`dockerInfrastructure`));
    }
}
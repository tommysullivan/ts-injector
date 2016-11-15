import {ICliConfig} from "../cli/i-cli-config";
import {IRestConfiguration} from "../rest/i-rest-configuration";
import {IClusterTestingConfiguration} from "../cluster-testing/i-cluster-testing-configuration";
import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IMCSConfiguration} from "../mcs/i-mcs-configuration";
import {IInstallerClientConfiguration} from "../installer/i-installer-client-configuration";
import {ICucumberConfiguration} from "../cucumber/i-cucumber-configuration";
import {IReleasingConfig} from "../releasing/i-releasing-config";
import {IPackagingConfig} from "../packaging/i-packaging-config";
import {IGrafanaConfig} from "../grafana/i-grafana-config";
import {ISSHConfiguration} from "../ssh/i-ssh-configuration";
import {IOpenTSDBConfiguration} from "../open-tsdb/i-open-tsdb-configuration";
import {IElasticsearchConfiguration} from "../elasticsearch/i-elasticsearch-configuration";
import {IESXIConfiguration} from "../esxi/configuration/i-esxi-configuration";
import {IClusterConfiguration} from "../clusters/i-cluster-configuration";
import {ITestingConfiguration} from "../testing/i-testing-configuration";

export interface IFrameworkConfiguration extends IJSONSerializable {
    releasing:IReleasingConfig;
    packaging:IPackagingConfig;
    rest:IRestConfiguration;
    grafana:IGrafanaConfig;
    cli:ICliConfig;
    mcs:IMCSConfiguration;
    installerClient:IInstallerClientConfiguration;
    clusterTesting:IClusterTestingConfiguration;
    cucumber:ICucumberConfiguration;
    ssh:ISSHConfiguration;
    openTSDB:IOpenTSDBConfiguration;
    elasticsearch:IElasticsearchConfiguration;
    clusters:Array<IClusterConfiguration>;
    esxi:IESXIConfiguration;
    testing:ITestingConfiguration;
}
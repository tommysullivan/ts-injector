import {IJSONObject} from "../typed-json/i-json-object";
import {IPath} from "../node-js-wrappers/i-path";
import {IProcess} from "../node-js-wrappers/i-process";
import {ICollections} from "../collections/i-collections";
import {IClusterTestingConfiguration} from "./i-cluster-testing-configuration";
import {ClusterInstallerConfig} from "../installer/cluster-installer-config";
import {IClusterInstallerConfig} from "../installer/i-cluster-installer-config";
import {ILogCaptureConfiguration} from "./i-log-capture-configuration";

export class ClusterTestingConfiguration implements IClusterTestingConfiguration {
    constructor(
        private configJSON:IJSONObject,
        private process:IProcess,
        private collections:ICollections
    ) {}

    get logsToCapture():Array<ILogCaptureConfiguration> {
        return this.configJSON.listNamed<ILogCaptureConfiguration>('logsToCapture').toArray();
    }

    get clusterInstaller():IClusterInstallerConfig {
        return new ClusterInstallerConfig(
            this.configJSON.jsonObjectNamed('clusterInstaller')
        );
    }

    get clusterIds():Array<string> {
        return this.collections.newList<string>(
            this.process.environmentVariables.hasKey('clusterIds')
                ? this.process.environmentVariableNamed('clusterIds').split(',')
                : this.process.environmentVariables.hasKey('clusterId')
                    ? [this.process.environmentVariableNamed('clusterId')]
                    : []
        ).toArray();
    }
}
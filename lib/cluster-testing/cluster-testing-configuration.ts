import {IJSONObject} from "../typed-json/i-json-object";
import {IPath} from "../node-js-wrappers/i-path";
import {IProcess} from "../node-js-wrappers/i-process";
import {ICollections} from "../collections/i-collections";
import {IClusterTestingConfiguration} from "./i-cluster-testing-configuration";
import {ClusterInstallerConfig} from "../installer/cluster-installer-config";
import {IClusterInstallerConfig} from "../installer/i-cluster-installer-config";

export class ClusterTestingConfiguration implements IClusterTestingConfiguration {
    private configJSON:IJSONObject;
    private basePathToUseForConfiguredRelativePaths:string;
    private path:IPath;
    private process:IProcess;
    private collections:ICollections;

    constructor(configJSON:IJSONObject, basePathToUseForConfiguredRelativePaths:string, path:IPath, process:IProcess, collections:ICollections) {
        this.configJSON = configJSON;
        this.basePathToUseForConfiguredRelativePaths = basePathToUseForConfiguredRelativePaths;
        this.path = path;
        this.process = process;
        this.collections = collections;
    }

    get portalUrl():string {
        return this.configJSON.jsonObjectNamed('resultServers')
            .stringPropertyNamed(this.process.environmentVariableNamed('portalId'));
    }

    get mcsLogFileLocation():string {
        return this.configJSON.stringPropertyNamed('mcsLogFileLocation');
    }

    get wardenLogLocation():string {
        return this.configJSON.stringPropertyNamed('wardenLogLocation');
    }

    get configureShLogLocation():string {
        return this.configJSON.stringPropertyNamed('configureShLogLocation');
    }

    get mfsInitLogFileLocation():string {
        return this.configJSON.stringPropertyNamed('mfsInitLogFileLocation');
    }

    get frameworkOutputPath():string {
        return this.path.join(
            this.basePathToUseForConfiguredRelativePaths,
            this.configJSON.stringPropertyNamed('frameworkOutputPathRelativeToThisConfigFile')
        );
    }

    get cucumberOutputPath():string {
        return this.path.join(
            this.basePathToUseForConfiguredRelativePaths,
            this.configJSON.stringPropertyNamed('cucumberOutputPathRelativeToThisConfigFile')
        );
    }

    get clusterInstallerConfiguration():IClusterInstallerConfig {
        return new ClusterInstallerConfig(
            this.configJSON.jsonObjectNamed('clusterInstaller')
        );
    }

    get releaseUnderTest():string {
        return this.process.environmentVariableNamedOrDefault(
            'release',
            this.configJSON.stringPropertyNamed('defaultRelease')
        );
    }

    get lifecyclePhase():string {
        return this.process.environmentVariableNamedOrDefault(
            'lifecyclePhase',
            this.configJSON.stringPropertyNamed('defaultLifecyclePhase')
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

    get throwErrorIfPackageJsonMissing():boolean {
        return this.process.environmentVariables.hasKey('portalId')
    }
}
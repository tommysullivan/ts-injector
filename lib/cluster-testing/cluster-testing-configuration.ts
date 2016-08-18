import IJSONObject from "../typed-json/i-json-object";
import ClusterInstallerConfig from "./cluster-installer-config";
import IPath from "../node-js-wrappers/i-path";
import IProcess from "../node-js-wrappers/i-process";
import ICollections from "../collections/i-collections";
import IList from "../collections/i-list";

export default class ClusterTestingConfiguration {
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

    private envVarOrConfiguredVal(propName:string):string {
        return this.process.environmentVariableNamedOrLazyDefault(
            propName,
            () => this.configJSON.stringPropertyNamed(propName)
        );
    }

    portalUrlWithId(id):string {
        return this.configJSON.jsonObjectNamed('resultServers').stringPropertyNamed(id);
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

    get clusterInstallerConfiguration():ClusterInstallerConfig {
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

    get clusterIds():IList<string> {
        return this.collections.newList<string>(
            this.process.environmentVariables().hasKey('clusterIds')
                ? this.process.environmentVariableNamed('clusterIds').split(',')
                : this.process.environmentVariables().hasKey('clusterId')
                ? [this.process.environmentVariableNamed('clusterId')]
                : []
        );
    }

    get throwErrorIfPackageJsonMissing():boolean {
        return this.process.environmentVariables().hasKey('portalId')
    }
}
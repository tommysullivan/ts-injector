import IJSONObject from "../typed-json/i-json-object";
import ClusterInstallerConfig from "./cluster-installer-config";
import IPath from "../node-js-wrappers/i-path";
import IProcess from "../node-js-wrappers/i-process";

export default class ClusterTestingConfiguration {
    private configJSON:IJSONObject;
    private basePathToUseForConfiguredRelativePaths:string;
    private path:IPath;
    private process:IProcess;

    constructor(configJSON:IJSONObject, basePathToUseForConfiguredRelativePaths:string, path:IPath, process:IProcess) {
        this.configJSON = configJSON;
        this.basePathToUseForConfiguredRelativePaths = basePathToUseForConfiguredRelativePaths;
        this.path = path;
        this.process = process;
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
}
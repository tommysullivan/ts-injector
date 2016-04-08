import IJSONObject from "../typed-json/i-json-object";
import ClusterInstallerConfig from "./cluster-installer-config";
import IPath from "../node-js-wrappers/i-path";

export default class ClusterTestingConfiguration {
    private configJSON:IJSONObject;
    private basePathToUseForConfiguredRelativePaths:string;
    private path:IPath;

    constructor(configJSON:IJSONObject, basePathToUseForConfiguredRelativePaths:string, path:IPath) {
        this.configJSON = configJSON;
        this.basePathToUseForConfiguredRelativePaths = basePathToUseForConfiguredRelativePaths;
        this.path = path;
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

    get defaultPhase():string { return this.configJSON.stringPropertyNamed('defaultPhase');}
}
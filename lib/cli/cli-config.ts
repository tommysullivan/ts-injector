import IJSONObject from "../typed-json/i-json-object";
import IPath from "../node-js-wrappers/i-path";

export default class CliConfig {
    private configJSON:IJSONObject;
    private basePathToUseForConfiguredRelativePaths:string;
    private path:IPath;

    constructor(configJSON:IJSONObject, basePathToUseForConfiguredRelativePaths:string, path:IPath) {
        this.configJSON = configJSON;
        this.basePathToUseForConfiguredRelativePaths = basePathToUseForConfiguredRelativePaths;
        this.path = path;
    }

    get temporaryTestRunOutputFilePath():string {
        return this.path.join(
            this.basePathToUseForConfiguredRelativePaths,
            this.configJSON.stringPropertyNamed('temporaryTestRunOutputFilePathRelativeToThisConfigFile')
        );
    }
}
import {IJSONObject} from "../typed-json/i-json-object";
import {IPath} from "../node-js-wrappers/i-path";
import {ICliConfig} from "./i-cli-config";

export class CliConfig implements ICliConfig {
    private configJSON:IJSONObject;
    private basePathToUseForConfiguredRelativePaths:string;
    private path:IPath;

    constructor(configJSON:IJSONObject, basePathToUseForConfiguredRelativePaths:string, path:IPath) {
        this.configJSON = configJSON;
        this.basePathToUseForConfiguredRelativePaths = basePathToUseForConfiguredRelativePaths;
        this.path = path;
    }

    get temporaryTestRunOutputFilePath():string {
        return 'data/tmp/tmp-test-run.json';
        // return this.path.join(
        //     this.basePathToUseForConfiguredRelativePaths,
        //     this.configJSON.stringPropertyNamed('temporaryTestRunOutputFilePathRelativeToThisConfigFile')
        // );
    }
}
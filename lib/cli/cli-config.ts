import {IJSONObject} from "../typed-json/i-json-object";
import {IPath} from "../node-js-wrappers/i-path";
import {ICliConfig} from "./i-cli-config";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";

export class CliConfig implements ICliConfig {
    
    constructor(
        private configJSON:IJSONObject,
        private basePathToUseForConfiguredRelativePaths:string,
        private path:IPath,
        private fileSystem:IFileSystem)
    {}

    get temporaryTestRunOutputFilePath():string {
        const tempPath = 'data/tmp/';
        if(!this.fileSystem.checkFileExistSync(tempPath))
            this.fileSystem.makeDirRecursive(tempPath);
        return `${tempPath}tmp-test-run.json`;
    }
}
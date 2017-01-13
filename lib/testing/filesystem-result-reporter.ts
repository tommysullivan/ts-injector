import {IResultReporter} from "./i-result-reporter";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {IPath} from "../node-js-wrappers/i-path";
import {IConsole} from "../console/i-console";
import {IFuture} from "../futures/i-future";
import {ITestingConfiguration} from "./i-testing-configuration";

export class FilesystemResultReporter implements IResultReporter {
    constructor(
        private fileSystem:IFileSystem,
        private testingConfiguration:ITestingConfiguration,
        private path:IPath,
        private console:IConsole
    ) {}
    
    reportResult(uniqueFileIdentifier:string, portalCompatibleJSONResultString:string):IFuture<any>  {
        const outputFileName = `${uniqueFileIdentifier}.json`;
        if(!this.fileSystem.checkFileExistSync(this.testingConfiguration.frameworkOutputPath))
            this.fileSystem.makeDirRecursive(this.testingConfiguration.frameworkOutputPath);
        const frameworkOutputPath = this.path.join(
            this.testingConfiguration.frameworkOutputPath,
            outputFileName
        );
        this.console.log(`Saving local enhanced result to file ${frameworkOutputPath}`);
        return this.fileSystem.writeFile(
            frameworkOutputPath,
            portalCompatibleJSONResultString
        );
    }
}
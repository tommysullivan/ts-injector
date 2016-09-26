import {IResultReporter} from "./i-result-reporter";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {IPath} from "../node-js-wrappers/i-path";
import {IConsole} from "../node-js-wrappers/i-console";
import {IFuture} from "../promise/i-future";
import {IClusterTestingConfiguration} from "./i-cluster-testing-configuration";
import {IClusterTestResult} from "./i-cluster-test-result";

export class FilesystemResultReporter implements IResultReporter {
    constructor(
        private fileSystem:IFileSystem,
        private clusterTestingConfiguration:IClusterTestingConfiguration,
        private path:IPath,
        private console:IConsole
    ) {}
    
    reportResult(uniqueFileIdentifier:string, clusterTestResult:IClusterTestResult):IFuture<IClusterTestResult>  {
        const outputFileName = `${uniqueFileIdentifier}.json`;
        if(!this.fileSystem.checkFileExistSync(this.clusterTestingConfiguration.frameworkOutputPath))
            this.fileSystem.makeDirRecursive(this.clusterTestingConfiguration.frameworkOutputPath);
        const frameworkOutputPath = this.path.join(
            this.clusterTestingConfiguration.frameworkOutputPath,
            outputFileName
        );
        this.console.log(`Saving local enhanced result to file ${frameworkOutputPath}`);
        return this.fileSystem.writeFile(
            frameworkOutputPath,
            clusterTestResult.toString()
        ).then(_ => clusterTestResult);
    }
}
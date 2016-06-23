import INodeWrapperFactory from "./i-node-wrapper-factory";
import ProcessResult from "./process-result";
import IProcess from "./i-process";
import Process from "./process";
import IPromiseFactory from "../promise/i-promise-factory";
import IList from "../collections/i-list";
import IProcessResult from "./i-process-result";
import ICollections from "../collections/i-collections";
import Console from "./console";
import IConsole from "./i-console";
import IPath from "./i-path";
import IFileSystem from "./i-filesystem";
import FileSystem from "./file-system";
import ITypedJSON from "../typed-json/i-typed-json";
import IErrors from "../errors/i-errors";
import FileStream from "./file-stream";
import IFileStream from "./i-file-stream";
import IBuffer from "./i-buffer";
import StringHelper from "./string-helper";
import IStringHelper from "./i-string-helper";

declare var Buffer:any;

export default class NodeWrapperFactory implements INodeWrapperFactory {

    constructor(
        private promiseFactory:IPromiseFactory,
        private childProcessModule:any,
        private collections:ICollections,
        private fsModule:any,
        private typedJSON:ITypedJSON,
        private errors:IErrors,
        private pathModule:any,
        private readLineSyncModule:any
    ) {}

    newStringHelper():IStringHelper {
        return new StringHelper();
    }

    get path():IPath {
        return <IPath>this.pathModule;
    }

    newFileStream(nativeFileStream):IFileStream {
        return new FileStream(nativeFileStream);
    }

    newProcessResult(command:string, processExitCode:number, stdoutParts:IList<string>, stderrParts:IList<string>, shellInvocationError:string):IProcessResult {
        return new ProcessResult(command, processExitCode, stdoutParts, stderrParts, shellInvocationError);
    }

    newProcess(nativeProcess:any):IProcess {
        return new Process(nativeProcess, this.promiseFactory, this.childProcessModule, this, this.collections);
    }

    newConsole(nativeConsole:any):IConsole {
        return new Console(nativeConsole, this.readLineSyncModule);
    }

    fileSystem():IFileSystem {
        return new FileSystem(
            this.fsModule,
            this.typedJSON,
            this.collections,
            this.errors,
            this,
            this.promiseFactory
        );
    }

    newStringBuffer(content:string):IBuffer {
        return new Buffer(content);
    }
}
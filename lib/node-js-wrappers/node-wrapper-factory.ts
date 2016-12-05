import {INodeWrapperFactory} from "./i-node-wrapper-factory";
import {ProcessResult} from "./process-result";
import {IProcess} from "./i-process";
import {Process} from "./process";
import {IProcessResult} from "./i-process-result";
import {ICollections} from "../collections/i-collections";
import {Console} from "./console";
import {IConsole} from "./i-console";
import {IPath} from "./i-path";
import {IFileSystem} from "./i-filesystem";
import {FileSystem} from "./file-system";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IErrors} from "../errors/i-errors";
import {FileStream} from "./file-stream";
import {IFileStream} from "./i-file-stream";
import {IBuffer} from "./i-buffer";
import {StringHelper} from "./string-helper";
import {IStringHelper} from "./i-string-helper";
import {BaseProcessResult} from "./base-process-result";
import {IList} from "../collections/i-list";
import {ProcessResultForSeparateStdAndErrorStreams} from "./process-result-for-separate-std-and-error-streams";
import {IFutures} from "../futures/i-futures";

declare const Buffer:any;

export class NodeWrapperFactory implements INodeWrapperFactory {

    constructor(
        private futures:IFutures,
        private childProcessModule:any,
        private collections:ICollections,
        private fsModule:any,
        private typedJSON:ITypedJSON,
        private errors:IErrors,
        private pathModule:any,
        private readLineSyncModule:any,
        private mkdirp:any
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

    newProcessResult(
        command:string,
        processExitCode:number,
        stdOutIndices:Array<number>,
        stdErrIndices:Array<number>,
        allOutput:Array<string>,
        shellInvocationError:string
    ):IProcessResult {
        return new ProcessResult(
            this.newBaseProcessResult(command, processExitCode, shellInvocationError),
            stdOutIndices,
            stdErrIndices,
            allOutput,
            this.collections
        );
    }

    newBaseProcessResult(command:string, processExitCode:number, shellInvocationError:string):IProcessResult {
        return new BaseProcessResult(
            command,
            processExitCode,
            shellInvocationError
        );
    }

    newProcessResultForSeparateStdAndErrorStreams(
        command:string,
        processExitCode:number,
        stdoutLines:IList<string>,
        stderrLines:IList<string>,
        shellInvocationError:string
    ):IProcessResult {
        return new ProcessResultForSeparateStdAndErrorStreams(
            this.newBaseProcessResult(command, processExitCode, shellInvocationError),
            stdoutLines,
            stderrLines,
            this.collections
        );
    }

    newProcess(nativeProcess:any):IProcess {
        return new Process(
            nativeProcess,
            this.futures,
            this.childProcessModule,
            this,
            this.collections
        );
    }

    newConsole(nativeConsole:any, logLevel:string):IConsole {
        return new Console(
            nativeConsole,
            this.readLineSyncModule,
            logLevel
        );
    }

    fileSystem():IFileSystem {
        return new FileSystem(
            this.fsModule,
            this.typedJSON,
            this.collections,
            this.errors,
            this,
            this.futures,
            this.mkdirp
        );
    }

    newStringBuffer(content:string):IBuffer {
        return new Buffer(content);
    }
}
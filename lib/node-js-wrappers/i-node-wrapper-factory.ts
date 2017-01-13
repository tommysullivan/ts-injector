import {IProcessResult} from "./i-process-result";
import {IList} from "../collections/i-list";
import {IProcess} from "./i-process";
import {IConsole} from "../console/i-console";
import {IPath} from "./i-path";
import {IFileSystem} from "./i-filesystem";
import {IFileStream} from "./i-file-stream";
import {IBuffer} from "./i-buffer";
import {IStringHelper} from "./i-string-helper";

export interface INodeWrapperFactory {
    newProcessResult(
        command:string,
        processExitCode:number,
        stdOutIndices:Array<number>,
        stdErrIndices:Array<number>,
        allOutput:Array<string>,
        shellInvocationError:string
    ):IProcessResult;

    newProcessResultForSeparateStdAndErrorStreams(
        command:string,
        processExitCode:number,
        stdOutLines:IList<string>,
        stdErrLines:IList<string>,
        shellInvocationError:string
    ):IProcessResult;

    newProcess(nativeProcess:any):IProcess;
    newConsole(nativeConsole:any, logLevel:string):IConsole;
    path:IPath;
    fileSystem():IFileSystem;
    newFileStream(nativeFileStream):IFileStream;
    newStringBuffer(content:string):IBuffer;
    newStringHelper():IStringHelper;
}
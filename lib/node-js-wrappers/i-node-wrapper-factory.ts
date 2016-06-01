import IProcessResult from "./i-process-result";
import IList from "../collections/i-list";
import IProcess from "./i-process";
import IConsole from "./i-console";
import IPath from "./i-path";
import IFileSystem from "./i-filesystem";
import IFileStream from "./i-file-stream";
import IBuffer from "./i-buffer";
import IStringHelper from "./i-string-helper";

interface INodeWrapperFactory {
    newProcessResult(command:string, processExitCode:number, stdoutParts:IList<string>, stderrParts:IList<string>, shellInvocationError:string):IProcessResult;
    newProcess(nativeProcess:any):IProcess;
    newConsole(nativeConsole:any):IConsole;
    path:IPath;
    fileSystem():IFileSystem;
    newFileStream(nativeFileStream):IFileStream;
    newStringBuffer(content:string):IBuffer;
    newStringHelper():IStringHelper;
}

export default INodeWrapperFactory;
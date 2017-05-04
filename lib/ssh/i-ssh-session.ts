import {IFuture} from "../futures/i-future";
import {ISSHResult} from "./i-ssh-result";
import {IFutureWithProgress} from "../futures/i-future-with-progress";

export interface IProcessOutputProgress {
    stdOut?:string;
    stdErr?:string;
}

export interface ISSHSession {
    executeCommands(...commands:Array<string>);
    executeCommand(command:string):IFutureWithProgress<IProcessOutputProgress, ISSHResult>;
    upload(localPath:string, destPath:string):IFuture<void>;
    download(remotePath:string, localPath:string):IFuture<void>;
    write(fileContent:string, destinationPath:string):IFuture<void>;
    read(remotePath:string):IFuture<string>;
    executeCommandWithRetryTimeout(command:string, timeout:number, maxTryCount:number):IFuture<ISSHResult>;
    readAsBinary(remotePath:string):IFuture<ArrayBuffer>;
    writeAsBinary(fileContent:ArrayBuffer, destinationPath:string):IFuture<void>;
}
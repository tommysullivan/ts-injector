import {IFuture} from "../promise/i-future";
import {ISSHResult} from "./i-ssh-result";

export interface ISSHSession {
    executeCommands(...commands:Array<string>);
    executeCommand(command:string):IFuture<ISSHResult>;
    upload(localPath:string, destPath:string):IFuture<any>;
    download(remotePath:string, localPath:string):IFuture<any>;
    write(fileContent:string, destinationPath:string):IFuture<any>;
    read(remotePath:string):IFuture<string>;
    executeCommandWithRetryTimeout(command:string, timeout:number, maxTryCount:number):IFuture<ISSHResult>;
    readAsBinary(remotePath:string):IFuture<ArrayBuffer>;
    writeAsBinary(fileContent:ArrayBuffer, destinationPath:string):IFuture<any>;
}
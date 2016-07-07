import IList from "../collections/i-list";
import IThenable from "../promise/i-thenable";
import ISSHResult from "./i-ssh-result";

interface ISSHSession {
    executeCommands(commands:IList<string>):IThenable<IList<ISSHResult>>;
    executeCommand(command:string):IThenable<ISSHResult>;
    upload(localPath:string, destPath:string):IThenable<any>;
    download(remotePath:string, localPath:string):IThenable<any>;
    write(fileContent:string, destinationPath:string):IThenable<any>;
    read(remotePath:string):IThenable<string>;
    executeCommandWithRetryTimeout(command:string, timeout:number, maxTryCount:number):IThenable<ISSHResult>;
    readAsBinary(remotePath:string):IThenable<ArrayBuffer>;
    writeAsBinary(fileContent:ArrayBuffer, destinationPath:string):IThenable<any>;
}

export default ISSHSession;
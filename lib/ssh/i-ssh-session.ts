import IList from "../collections/i-list";
import IThenable from "../promise/i-thenable";
import ISSHResult from "./i-ssh-result";

interface ISSHSession {
    executeCommands(commands:IList<string>):IThenable<IList<ISSHResult>>;
    executeCommand(command:string):IThenable<ISSHResult>;
    upload(localPath:string, destPath:string):IThenable<any>;
    download(remotePath:string, localPath:string):IThenable<any>;
    write(fileContent:string, destinationPath:string):IThenable<any>;
}

export default ISSHSession;
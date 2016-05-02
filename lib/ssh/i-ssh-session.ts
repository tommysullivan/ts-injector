import IList from "../collections/i-list";
import IThenable from "../promise/i-thenable";
import ISSHResult from "./i-ssh-result";

interface ISSHSession {
    executeCommands(commands:IList<string>):IThenable<IList<ISSHResult>>;
    executeCommand(command:string):IThenable<ISSHResult>;
    copyCommand(localPath:string, destPath:string):IThenable<ISSHResult>;
}

export default ISSHSession;
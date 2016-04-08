import ISSHSession from './i-ssh-session';
import IThenable from "../promise/i-thenable";

interface ISSHClient {
    connect(host:String, username:String, password:String):IThenable<ISSHSession>
}

export default ISSHClient;
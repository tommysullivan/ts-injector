import {IList} from "../collections/i-list";
import {ISSHResult} from "../ssh/i-ssh-result";

export class SharedData {
    lastCommandResultSet:IList<ISSHResult>;
    mountPath:string;
}
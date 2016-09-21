import {IList} from "../collections/i-list";
import {ISSHResult} from "../ssh/i-ssh-result";

export class NodeVersionGraph {
    private host:string;
    private commandResultSet:IList<ISSHResult>;

    constructor(host:string, commandResultSet:IList<ISSHResult>) {
        this.host = host;
        this.commandResultSet = commandResultSet;
    }

    toJSON():any {
        return {
            host: this.host,
            sshCommandResults: this.commandResultSet.toJSON()
        }
    }

    toString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }
}
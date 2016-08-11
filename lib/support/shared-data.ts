import IList from "../collections/i-list";
import IDictionary from "../collections/i-dictionary";
import ISSHResult from "../ssh/i-ssh-result";

export default class SharedData {
    lastCommandResultSet:IList<ISSHResult>;
    clusterName:string;
    mountPath:string;
    volumeName:string;
    volumeDictionary:IDictionary<number>;
    alarmName:string;
    alarmEntity:string;
    
}
import IList from "../collections/i-list";
import ISnapshotConfiguration from "../esxi/configuration/i-snapshot-configuration";
import IESXINodeConfiguration from "../esxi/configuration/i-esxi-node-configuration";
import IOperatingSystemConfig from "./../operating-systems/i-operating-system-config";

interface INodeConfiguration {
    host:string;
    username:string;
    password:string;
    operatingSystem:IOperatingSystemConfig;
    serviceNames:IList<string>;
    name:string;
    esxiNodeConfiguration:IESXINodeConfiguration;
    snapshotIdFromStateName(stateName:string):number;
    toJSON():any;
}

export default INodeConfiguration;
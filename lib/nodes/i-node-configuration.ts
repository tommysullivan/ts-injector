import IList from "../collections/i-list";
import ISnapshotConfiguration from "../esxi/configuration/i-snapshot-configuration";
import IESXINodeConfiguration from "../esxi/configuration/i-esxi-node-configuration";
import IOperatingSystem from "./../operating-systems/i-operating-system";

interface INodeConfiguration {
    host:string;
    username:string;
    password:string;
    operatingSystem:IOperatingSystem;
    serviceNames:IList<string>;
    name:string;
    esxiNodeConfiguration:IESXINodeConfiguration;
    snapshotIdFromStateName(stateName:string):number;
    toJSON():any;
}

export default INodeConfiguration;
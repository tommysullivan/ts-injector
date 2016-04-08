import INodeConfiguration from "./../nodes/i-node-configuration";
import IList from "../collections/i-list";
import IESXIServerConfiguration from "../esxi/configuration/i-esxi-server-configuration";

interface IClusterConfiguration {
    id:string;
    name:string;
    nodes:IList<INodeConfiguration>;
    adminPassword:string;
    esxiServerConfiguration:IESXIServerConfiguration;
    toJSON():any;
}

export default IClusterConfiguration;
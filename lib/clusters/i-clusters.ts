import {IClusterConfiguration} from "./i-cluster-configuration";
import {IList} from "../collections/i-list";

export interface IClusters {
    clusterConfigurationWithId(id:string):IClusterConfiguration;
    allIds:IList<string>;
    allConfigurations:IList<IClusterConfiguration>;
}
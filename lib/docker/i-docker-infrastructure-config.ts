import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IMesosClusterConfiguration} from "./i-mesos-cluster-config";
import {IDockerClusterConfiguration} from "./i-docker-cluster-config";
import {IList} from "../collections/i-list";

export interface IDockerInfrastructureConfiguration extends IJSONSerializable {
    dockerRepo:string;
    mesosClusters:Array<IMesosClusterConfiguration>;
    dockerClusters:Array<IDockerClusterConfiguration>;
}
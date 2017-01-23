import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface IMesosClusterConfiguration extends IJSONSerializable {
    id:string;
    mesosMasterIP:string;
    mesosMasterPort:string;
    marathonIP:string;
    marathonPort:string;
    marathonUser?:string;
    marathonPassword?:string;
    mesosSlaves:Array<string>;
    maprNfsServerIP:string;
    dockerVolumeMountPath?:string;
    dockerVolumeLocalPath?:string;
}
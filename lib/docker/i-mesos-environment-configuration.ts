import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface IMesosEnvironmentConfiguration extends IJSONSerializable {
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
    dockerImagesUserName?:string;
    dockerImagesPassword?:string;
}
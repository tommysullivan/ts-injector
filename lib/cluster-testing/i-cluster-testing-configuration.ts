import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IClusterInstallerConfig} from "../installer/i-cluster-installer-config";
import {ILogCaptureConfiguration} from "./i-log-capture-configuration";

export interface IClusterTestingConfiguration extends IJSONSerializable {
    clusterInstaller:IClusterInstallerConfig;
    clusterIds:Array<string>;
    logsToCapture:Array<ILogCaptureConfiguration>;
}
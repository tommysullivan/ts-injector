import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IClusterInstallerConfig} from "../installer/i-cluster-installer-config";

export interface IClusterTestingConfiguration extends IJSONSerializable {
    portalUrl:string;
    mcsLogFileLocation:string;
    wardenLogLocation:string;
    configureShLogLocation:string;
    mfsInitLogFileLocation:string;
    frameworkOutputPath:string;
    cucumberOutputPath:string;
    clusterInstallerConfiguration:IClusterInstallerConfig;
    releaseUnderTest:string;
    lifecyclePhase:string;
    clusterIds:Array<string>;
    throwErrorIfPackageJsonMissing:boolean;
}
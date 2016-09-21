import {IOperatingSystem} from "./i-operating-system";
import {IOperatingSystemConfig} from "./i-operating-system-config";

export interface IOperatingSystems {
    newOperatingSystemFromConfig(config:IOperatingSystemConfig):IOperatingSystem;
}
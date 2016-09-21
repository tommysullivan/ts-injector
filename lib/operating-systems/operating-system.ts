import {IOperatingSystem} from "./i-operating-system";
import {IOperatingSystemConfig} from "./i-operating-system-config";

export class OperatingSystem implements IOperatingSystem {
    constructor(
        private config:IOperatingSystemConfig,
        private _systemInfoCommand:string
    ) {}

    get name():string { return this.config.name; }
    get version():string { return this.config.version; }
    get systemInfoCommand():string { return this._systemInfoCommand; }
}
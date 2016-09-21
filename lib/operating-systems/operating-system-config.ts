import {IOperatingSystemConfig} from "./i-operating-system-config";
import {IJSONObject} from "../typed-json/i-json-object";

export class OperatingSystemConfig implements IOperatingSystemConfig {
    constructor(
        private configJSON:IJSONObject
    ) {}

    get name():string {
        return this.configJSON.stringPropertyNamed('name');
    }

    get version():string {
        return this.configJSON.stringPropertyNamed('version');
    }

}
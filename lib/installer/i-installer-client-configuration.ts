import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface IInstallerClientConfiguration extends IJSONSerializable {
    installerAPIPath:string;
    installerLoginPath:string;
    installerPollingFrequencyMS:number;
}
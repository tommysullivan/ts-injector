import {ILogCaptureConfiguration} from "./i-log-capture-configuration";
import {IJSONObject} from "../typed-json/i-json-object";

export class LogCaptureConfiguration implements ILogCaptureConfiguration {

    constructor(private configJSON: IJSONObject) {
    }

    get title(): string {
        return this.configJSON.stringPropertyNamed(`title`)
    }

    get location(): string {
        return this.configJSON.stringPropertyNamed(`location`)
    }

    get nodesHosting(): string {
        return this.configJSON.hasPropertyNamed(`nodesHosting`)
            ? this.configJSON.stringPropertyNamed(`nodesHosting`)
            : null;
    }

    get isLocalToTestRunner(): boolean {
        return this.configJSON.hasPropertyNamed(`isLocalToTestRunner`)
            ? this.configJSON.booleanPropertyNamed(`isLocalToTestRunner`)
            : null;
    }
}
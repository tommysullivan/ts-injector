import {IJSONObject} from "../typed-json/i-json-object";
import {IOpenTSDBConfiguration} from "./i-open-tsdb-configuration";

export class OpenTSDBConfiguration implements IOpenTSDBConfiguration {
    constructor(
        private openTSDBConfigJSON:IJSONObject
    ) {}

    get openTSDBQueryPathTemplate():string {
        return this.openTSDBConfigJSON.getProperty<string>('openTSDBQueryPathTemplate');
    }

    get openTSDBUrlTemplate():string {
        return this.openTSDBConfigJSON.getProperty<string>('openTSDBUrlTemplate');
    }
}
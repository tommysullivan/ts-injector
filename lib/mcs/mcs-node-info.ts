import {IMCSNodeInfo} from "./i-mcs-node-info";
import {IJSONObject} from "../typed-json/i-json-object";

export class MCSNodeInfo implements IMCSNodeInfo {
    constructor(
        private nodeInfoJSONObject:IJSONObject
    ){}

    get ip():string {
        return this.nodeInfoJSONObject.stringPropertyNamed(`ip`);
    }

    get services():Array<string> {
        return this.nodeInfoJSONObject.stringPropertyNamed(`service`).split(`,`);
    }

    get configuredServices(): Array<string> {
        return this.nodeInfoJSONObject.stringPropertyNamed(`configuredservice`).split(`,`);
    }
}
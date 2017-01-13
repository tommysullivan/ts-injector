import {IServiceGroupConfig} from "./i-service-group-config";
import {IJSONValue} from "../typed-json/i-json-value";
import {IJSONObject} from "../typed-json/i-json-object";

export class ServiceGroupConfig implements  IServiceGroupConfig {
    constructor (
        private configJSON:IJSONObject
    ){}

    get id():string {
        return this.configJSON.stringPropertyNamed('id');
    }

    get serviceNames():Array<string> {
        return this.configJSON.listNamed<string>('serviceNames').toArray();
    }

    toJSON():IJSONValue { return this.configJSON.toJSON(); }
}
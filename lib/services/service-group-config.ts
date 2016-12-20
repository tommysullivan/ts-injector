import {IServiceGroupConfig} from "./i-service-group-config";

export class ServiceGroupConfig implements  IServiceGroupConfig {
    constructor (
        private configJSON:any
    ){}

    get id():string {
            return this.configJSON.id
    }

    get serviceNames():Array<string> {
            return this.configJSON.serviceNames;
    }

    toJSON():string { return this.configJSON.toJSON(); }
}
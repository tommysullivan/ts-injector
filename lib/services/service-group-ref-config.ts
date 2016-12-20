import {IServiceGroupRefConfiguration} from "./i-service-group-ref-config";

export class ServiceGroupRefConfiguration implements IServiceGroupRefConfiguration {
    constructor(
        private configJSON:any
    ) {}

    get serviceGroupRef():string {
        return this.configJSON.serviceGroupRef;
    }

    toJSON():string { return this.configJSON.toJSON(); }
}

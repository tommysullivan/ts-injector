import {IServiceGroupRefConfiguration} from "./i-service-group-ref-config";
import {IJSONValue} from "../typed-json/i-json-value";

export class ServiceGroupRefConfiguration implements IServiceGroupRefConfiguration {
    constructor(
        private configJSON:IJSONValue
    ) {}

    get serviceGroupRef():string {
        return this.configJSON['serviceGroupRef'];
    }

    toJSON():IJSONValue { return this.configJSON; }
}

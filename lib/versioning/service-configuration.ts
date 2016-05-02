import IServiceConfig from "./i-service-config";
import IJSONObject from "../typed-json/i-json-object";

export default class ServiceConfiguration implements IServiceConfig {
    private serviceConfigJSON:IJSONObject;

    constructor(serviceConfigJSON:IJSONObject) {
        this.serviceConfigJSON = serviceConfigJSON;
    }

    get isHealthCheckable():boolean { return this.serviceConfigJSON.booleanPropertyNamed('healthCheckable'); }
    get name():string { return this.serviceConfigJSON.stringPropertyNamed('name'); }
    get version():string { return this.serviceConfigJSON.stringPropertyNamed('version'); }
    get isCore():boolean { return this.serviceConfigJSON.booleanPropertyNamed('core'); }
    
    toJSON():any { return this.serviceConfigJSON.toRawJSON(); }
}
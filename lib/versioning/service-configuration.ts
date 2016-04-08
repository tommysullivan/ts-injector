import IServiceConfig from "./i-service-config";
import IJSONObject from "../typed-json/i-json-object";

export default class ServiceConfiguration implements IServiceConfig {
    private serviceConfigJSON:IJSONObject;

    constructor(serviceConfigJSON:IJSONObject) {
        this.serviceConfigJSON = serviceConfigJSON;
    }

    get name():string { return this.serviceConfigJSON.stringPropertyNamed('name'); }
    get version():string { return this.serviceConfigJSON.stringPropertyNamed('version'); }
    
    toJSON():any { return this.serviceConfigJSON.toRawJSON(); }
}
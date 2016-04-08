import IJSONObject from "../typed-json/i-json-object";
import IServiceConfig from "./i-service-config";
import IList from "../collections/i-list";
import ServiceConfiguration from "./service-configuration";

export default class VersioningConfig {
    private configJSON:IJSONObject;

    constructor(configJSON:IJSONObject) {
        this.configJSON = configJSON;
    }
    
    serviceSet():IList<IServiceConfig> {
        return this.configJSON.listOfJSONObjectsNamed('serviceSet').map(
            serviceJSON=>new ServiceConfiguration(serviceJSON)
        )
    }
}
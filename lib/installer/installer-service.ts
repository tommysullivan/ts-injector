import IJSONObject from "../typed-json/i-json-object";
import IList from "../collections/i-list";
import IThenable from "../promise/i-thenable";
import RestClientAsPromised from "../rest/rest-client-as-promised";
import ITypedJSON from "../typed-json/i-typed-json";

export default class InstallerService {
    private installerServiceJSON:IJSONObject;
    private authedRestClient:RestClientAsPromised;
    private typedJSON:ITypedJSON;

    constructor(installerServiceJSON:IJSONObject, authedRestClient:RestClientAsPromised, typedJSON:ITypedJSON) {
        this.installerServiceJSON = installerServiceJSON;
        this.authedRestClient = authedRestClient;
        this.typedJSON = typedJSON;
    }

    get name():string {
        return this.installerServiceJSON.stringPropertyNamed('name');
    }

    get version():string {
        return this.installerServiceJSON.stringPropertyNamed('version');
    }

    hostNames():IThenable<IList<string>> {
        const serviceHostsURL = this.installerServiceJSON.dictionaryNamed<string>('links').get('hosts');
        return this.authedRestClient.get(serviceHostsURL)
            .then(response=>{
                const serviceHostsJSON = this.typedJSON.newJSONObject(response.jsonBody());
                return serviceHostsJSON.listNamed<any>('resources').map(r=>r.id);
            });
    }
}
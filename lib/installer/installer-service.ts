import {IJSONObject} from "../typed-json/i-json-object";
import {IList} from "../collections/i-list";
import {IFuture} from "../promise/i-future";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IInstallerService} from "./i-installer-service";
import {IRestClientAsPromised} from "../rest/i-rest-client-as-promised";

export class InstallerService implements IInstallerService {
    constructor(
        private installerServiceJSON:IJSONObject,
        private authedRestClient:IRestClientAsPromised,
        private typedJSON:ITypedJSON
    ) {}

    get name():string {
        return this.installerServiceJSON.stringPropertyNamed('name');
    }

    get version():string {
        return this.installerServiceJSON.stringPropertyNamed('version');
    }

    hostNames():IFuture<IList<string>> {
        const serviceHostsURL = this.installerServiceJSON.dictionaryNamed<string>('links').get('hosts');
        return this.authedRestClient.get(serviceHostsURL)
            .then(response=>{
                const serviceHostsJSON = this.typedJSON.newJSONObject(response.jsonBody);
                return serviceHostsJSON.listNamed<any>('resources').map(r=>r.id);
            });
    }
}
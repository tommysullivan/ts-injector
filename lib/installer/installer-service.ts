import {IJSONObject} from "../typed-json/i-json-object";
import {IList} from "../collections/i-list";
import {IFuture} from "../futures/i-future";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IInstallerService} from "./i-installer-service";
import {IRestClient} from "../rest/common/i-rest-client";

export class InstallerService implements IInstallerService {
    constructor(
        private installerServiceJSON:IJSONObject,
        private authedRestClient:IRestClient,
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
                const serviceHostsJSON = this.typedJSON.newJSONObject(response.jsonHash);
                return serviceHostsJSON.listNamed<any>('resources').map(r=>r.id);
            });
    }
}
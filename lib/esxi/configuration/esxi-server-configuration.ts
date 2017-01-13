import {IESXIServerConfiguration} from "./i-esxi-server-configuration";
import {IJSONObject} from "../../typed-json/i-json-object";
import {IJSONValue} from "../../typed-json/i-json-value";

export class ESXIServerConfiguration implements IESXIServerConfiguration {
    private esxiServerJSON:IJSONObject;

    constructor(esxiServerJSON:IJSONObject) {
        this.esxiServerJSON = esxiServerJSON;
    }

    get id():string { return this.esxiServerJSON.stringPropertyNamed('id'); }
    get host():string { return this.esxiServerJSON.stringPropertyNamed('host'); }
    get username():string {return this.esxiServerJSON.stringPropertyNamed('username'); }
    get password():string {return this.esxiServerJSON.stringPropertyNamed('password'); }
    get type():string {return this.esxiServerJSON.stringPropertyNamed('type'); }

    toJSON():IJSONValue { return this.esxiServerJSON.toJSON(); }
}
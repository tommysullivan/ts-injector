import {IJSONObject} from "../typed-json/i-json-object";
import {IMCSConfiguration} from "./i-mcs-configuration";

export class MCSConfiguration implements IMCSConfiguration {

    constructor(
        private configJSON:IJSONObject
    ) {}

    get mcsLoginPath():string { return this.configJSON.stringPropertyNamed('mcsLoginPath'); }
    get mcsDashboardInfoPath():string { return this.configJSON.stringPropertyNamed('mcsDashboardInfoPath'); }
    get mcsApplicationLinkPathTemplate():string { return this.configJSON.stringPropertyNamed('mcsApplicationLinkPathTemplate'); }
    get username():string { return this.configJSON.stringPropertyNamed('username'); }
    get password():string { return this.configJSON.stringPropertyNamed('password'); }
    get mcsUrlTemplate():string { return this.configJSON.stringPropertyNamed('mcsUrlTemplate'); }

    toJSON():any {
        return this.configJSON.toJSON();
    }
}
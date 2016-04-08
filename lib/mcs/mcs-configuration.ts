import IList from "../collections/i-list";
import IJSONObject from "../typed-json/i-json-object";

export default class MCSConfiguration {
    private configJSON:IJSONObject;

    constructor(configJSON:IJSONObject) {
        this.configJSON = configJSON;
    }

    get mcsLoginPath():string { return this.configJSON.stringPropertyNamed('mcsLoginPath'); }
    get mcsDashboardInfoPath():string { return this.configJSON.stringPropertyNamed('mcsDashboardInfoPath'); }
    get mcsApplicationLinkPathTemplate():string { return this.configJSON.stringPropertyNamed('mcsApplicationLinkPathTemplate'); }
    get username():string { return this.configJSON.stringPropertyNamed('username'); }
    get password():string { return this.configJSON.stringPropertyNamed('password'); }
    get mcsUrlTemplate():string { return this.configJSON.stringPropertyNamed('mcsUrlTemplate'); }
}
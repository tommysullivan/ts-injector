import IJSONObject from "../typed-json/i-json-object";
export default class InstallerClientConfiguration {
    private configJSON:IJSONObject;

    constructor(configJSON:IJSONObject) {
        this.configJSON = configJSON;
    }

    get installerAPIPath():string {
        return this.configJSON.stringPropertyNamed('installerAPIPath');
    }

    get installerLoginPath():string {
        return this.configJSON.stringPropertyNamed('installerLoginPath');
    }

    get installerPollingFrequencyMS():number {
        return this.configJSON.numericPropertyNamed('installerPollingFrequencyMS');
    }
}
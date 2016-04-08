import IJSONObject from "../typed-json/i-json-object";
import IList from "../collections/i-list";

export default class ClusterInstallerConfig {
    private configJSON:IJSONObject;

    constructor(configJSON:IJSONObject) {
        this.configJSON = configJSON;
    }

    get installationTimeoutInMilliseconds():number {
        return this.configJSON.numericPropertyNamed('installationTimeoutInMilliseconds');
    }

    get licenseType():string {
        return this.configJSON.stringPropertyNamed('licenseType');
    }

    get sshMethod():string {
        return this.configJSON.stringPropertyNamed('sshMethod');
    }

    get sshUsername():string {
        return this.configJSON.stringPropertyNamed('sshUsername');
    }

    get sshPassword():string {
        return this.configJSON.stringPropertyNamed('sshPassword');
    }

    get adminUsername():string {
        return this.configJSON.stringPropertyNamed('adminUsername');
    }

    get adminPassword():string {
        return this.configJSON.stringPropertyNamed('adminPassword');
    }

    get coreVersion():string {
        return this.configJSON.stringPropertyNamed('coreVersion');
    }

    get location():string {
        return this.configJSON.stringPropertyNamed('location');
    }

    get disks():IList<string> {
        return this.configJSON.listNamed<string>('disks');
    }

}
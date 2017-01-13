import {IFuture} from "../futures/i-future";
import {IInstallerServerConfiguration} from "./i-installer-server-configuration";
import {IJSONObject} from "../typed-json/i-json-object";
import {IList} from "../collections/i-list";
import {IRestClient} from "../rest/common/i-rest-client";
import {IInstaller} from "./i-installer";

export class InstallerServerConfiguration implements IInstallerServerConfiguration {
    constructor(
        private installer:IInstaller,
        private serverConfigJSON:IJSONObject,
        private authedRestClient:IRestClient,
        private serverConfigResourceURL:string
    ) {}

    private setServiceEnablement(serviceName:string, version:string, enabled:boolean):IInstallerServerConfiguration {
        this.serverConfigJSON.dictionaryNamed('services').add(serviceName, {
            version: version,
            enabled: enabled
        });
        return this;
    }

    enableService(serviceName:string, version:string):IInstallerServerConfiguration {
        return this.setServiceEnablement(serviceName, version, true);
    }

    disableService(serviceName:string, version:string):IInstallerServerConfiguration {
        return this.setServiceEnablement(serviceName, version, false);
    }

    setSSHPassword(newValue:string):IInstallerServerConfiguration { this.serverConfigJSON.setProperty('ssh_password', newValue); return this; }
    setClusterAdminPassword(newValue:string):IInstallerServerConfiguration { this.serverConfigJSON.setProperty('cluster_admin_password', newValue); return this; }
    setSSHUsername(newValue:string):IInstallerServerConfiguration { this.serverConfigJSON.setProperty('ssh_id', newValue); return this; }
    setSSHMethod(newValue:string):IInstallerServerConfiguration { this.serverConfigJSON.setProperty('ssh_method', newValue); return this; }
    setLicenseType(newValue:string):IInstallerServerConfiguration { this.serverConfigJSON.setProperty('license_type', newValue); return this; }
    setDisks(newValue:IList<string>):IInstallerServerConfiguration { this.serverConfigJSON.setProperty('disks', newValue.toArray()); return this; }
    setHosts(newValue:IList<string>):IInstallerServerConfiguration { this.serverConfigJSON.setProperty('hosts', newValue.toArray()); return this; }
    setClusterName(newValue:string):IInstallerServerConfiguration { this.serverConfigJSON.setProperty('cluster_name', newValue); return this; }

    save():IFuture<IInstallerServerConfiguration> {
        return this.authedRestClient.put(this.serverConfigResourceURL, this.serverConfigJSON.toJSON())
            .then(ignoredPutResult => this.authedRestClient.get(this.serverConfigResourceURL))
            .then(getResult=>{
                this.serverConfigJSON = getResult.bodyAsJsonObject;
                return this.installer.newInstallerServerConfiguration(
                    this.serverConfigJSON,
                    this.authedRestClient,
                    this.serverConfigResourceURL
                );
            });
    }

    toString():string {
        return this.toJSONString();
    }

    toJSONString():string {
        return JSON.stringify(this.serverConfigJSON, null, 3);
    }
}
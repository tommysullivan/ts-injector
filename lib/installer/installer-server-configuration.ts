import Installer from "./installer";
import RestClientAsPromised from "../rest/rest-client-as-promised";
import IThenable from "../promise/i-thenable";
import IInstallerServerConfiguration from "./i-installer-server-configuration";
import IJSONObject from "../typed-json/i-json-object";
import IList from "../collections/i-list";

export default class InstallerServerConfiguration implements IInstallerServerConfiguration {
    private installer:Installer;
    private serverConfigJSON:IJSONObject;
    private authedRestClient:RestClientAsPromised;
    private serverConfigResourceURL:string;

    constructor(installer:Installer, serverConfigJSON:IJSONObject, authedRestClient:RestClientAsPromised, serverConfigResourceURL:string) {
        this.installer = installer;
        this.serverConfigJSON = serverConfigJSON;
        this.authedRestClient = authedRestClient;
        this.serverConfigResourceURL = serverConfigResourceURL;
    }

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

    save():IThenable<IInstallerServerConfiguration> {
        var putArgs = {
            body: this.serverConfigJSON.toRawJSON(),
            json: true
        }
        return this.authedRestClient.put(this.serverConfigResourceURL, putArgs)
            .then(ignoredPutResult => this.authedRestClient.get(this.serverConfigResourceURL))
            .then(getResult=>{
                this.serverConfigJSON = getResult.jsonBody();
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
import {ISSHAPI} from "../ssh/i-ssh-api";
import {ICollections} from "../collections/i-collections";
import {IESXIClient} from "./i-esxi-client";
import {IList} from "../collections/i-list";
import {ESXIClient} from "./esxi-client";
import {IESXIServerConfiguration} from "./configuration/i-esxi-server-configuration";
import {IESXI} from "./i-esxi";
import {IESXIConfiguration} from "./configuration/i-esxi-configuration";

export class ESXI implements IESXI {
    constructor(
        private sshAPI:ISSHAPI,
        private collections:ICollections,
        private esxiConfiguration:IESXIConfiguration
    ) {}

    newESXIClient(host:string, username:string, password:string, vmId:number):IESXIClient {
        return new ESXIClient(this.sshAPI, host, username, password, this.collections, vmId);
    }

    esxiServers():IList<IESXIServerConfiguration> {
        return this.collections.newList(this.esxiConfiguration.servers);
    }

    esxiServerConfigurationForId(id:string):IESXIServerConfiguration {
        return this.esxiServers().firstWhere(e=>e.id==id);
    }
}
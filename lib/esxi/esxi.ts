import ISSHAPI from "../ssh/i-ssh-api";
import ICollections from "../collections/i-collections";
import IESXIClient from "./i-esxi-client";
import IList from "../collections/i-list";
import ESXIClient from "./esxi-client";
import IESXIServerConfiguration from "./configuration/i-esxi-server-configuration";
import ESXIConfiguration from "./configuration/esxi-configuration";
import IESXI from "./i-esxi";

export default class ESXI implements IESXI {
    private sshAPI:ISSHAPI;
    private collections:ICollections;
    private esxiConfiguration:ESXIConfiguration;

    constructor(sshAPI:ISSHAPI, collections:ICollections, esxiConfiguration:ESXIConfiguration) {
        this.sshAPI = sshAPI;
        this.collections = collections;
        this.esxiConfiguration = esxiConfiguration;
    }

    newESXIClient(host:string, username:string, password:string, vmId:number):IESXIClient {
        return new ESXIClient(this.sshAPI, host, username, password, this.collections, vmId);
    }

    esxiServers():IList<IESXIServerConfiguration> {
        return this.esxiConfiguration.servers;
    }

    esxiServerConfigurationForId(id:string):IESXIServerConfiguration {
        return this.esxiServers().firstWhere(e=>e.id==id);
    }
}
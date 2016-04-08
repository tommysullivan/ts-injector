import IESXIClient from "./i-esxi-client";
import IList from "../collections/i-list";
import IESXIServerConfiguration from "./configuration/i-esxi-server-configuration";

interface IESXI {
    newESXIClient(host:string, username:string, password:string, vmId:number):IESXIClient;
    esxiServers():IList<IESXIServerConfiguration>;
    esxiServerConfigurationForId(id:string):IESXIServerConfiguration;
}

export default IESXI;
import {IMCSServiceInfo} from "./i-mcs-service-info";
import {IList} from "../collections/i-list";
import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface IMCSDashboardInfo extends IJSONSerializable {
    services:IList<IMCSServiceInfo>;
}
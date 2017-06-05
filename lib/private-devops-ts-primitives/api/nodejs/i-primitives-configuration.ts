import {IRestConfiguration} from "../../rest/common/i-rest-configuration";
import {ISSHConfiguration} from "../../ssh/i-ssh-configuration";
import {IJSONSerializable} from "../../typed-json/i-json-serializable";
import {LogLevel} from "../../console/console";

export interface IPrimitivesConfiguration extends IJSONSerializable {
    rest:IRestConfiguration;
    ssh:ISSHConfiguration;
    logLevel:LogLevel;
}
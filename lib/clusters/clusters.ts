import {IClusterConfiguration} from "./i-cluster-configuration";
import {IList} from "../collections/i-list";
import {IErrors} from "../errors/i-errors";
import {IClusters} from "./i-clusters";
import {ClusterConfiguration} from "./cluster-configuration";
import {IJSONObject} from "../typed-json/i-json-object";
import {IESXI} from "../esxi/i-esxi";
import {IOperatingSystems} from "../operating-systems/i-operating-systems";

export class Clusters implements IClusters {
    constructor(
        private clusterConfigurations:IList<IClusterConfiguration>,
        private errors:IErrors,
        private esxi:IESXI,
        private operatingSystems:IOperatingSystems
    ) {}

    clusterConfigurationWithId(id:string):IClusterConfiguration {
        try {
            return this.allConfigurations.firstWhere(c=>c.id==id);
        }
        catch(e) {
            throw this.errors.newErrorWithCause(e, `Failed to find configuration with id "${id}"`);
        }
    }

    get allIds():IList<string> {
        return this.allConfigurations.map(c=>c.id);
    }

    get allConfigurations():IList<IClusterConfiguration> {
        return this.clusterConfigurations;
    }
}
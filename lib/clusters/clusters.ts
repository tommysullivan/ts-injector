import IClusterConfiguration from "./i-cluster-configuration";
import IJSONObject from "../typed-json/i-json-object";
import IList from "../collections/i-list";
import ClusterConfiguration from "./cluster-configuration";
import IESXI from "../esxi/i-esxi";
import IErrors from "../errors/i-errors";
import ICollections from "../collections/i-collections";

export default class Clusters {
    private clusterJSONs:IList<IJSONObject>;
    private esxi:IESXI;
    private errors:IErrors;
    private collections:ICollections;

    constructor(clusterJSONs:IList<IJSONObject>, esxi:IESXI, errors:IErrors, collections:ICollections) {
        this.clusterJSONs = clusterJSONs;
        this.esxi = esxi;
        this.errors = errors;
        this.collections = collections;
    }

    clusterConfigurationWithId(id:string):IClusterConfiguration {
        try {
            return this.allConfigurations.firstWhere(c=>c.id==id);
        }
        catch(e) {
            throw this.errors.newErrorWithCause(e, `Failed to find configuration with id "${id}"`);
        }
    }

    allIds():IList<string> {
        return this.allConfigurations.map(c=>c.id);
    }

    get allConfigurations():IList<IClusterConfiguration> {
        return this.clusterJSONs.map(
            clusterConfigJSON=>this.newClusterConfiguration(clusterConfigJSON)
        );
    }

    newClusterConfiguration(clusterConfigJSON:IJSONObject):IClusterConfiguration {
        return new ClusterConfiguration(clusterConfigJSON, this.esxi, this.collections);
    }
}
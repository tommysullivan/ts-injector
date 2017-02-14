import {IClusterUnderTestReferencer} from "./i-cluster-under-test-referencer";
import {ICluster} from "../clusters/i-cluster";
import {IProcess} from "../node-js-wrappers/i-process";
import {IClusterTesting} from "./i-cluster-testing";
import {IClusterTestingConfiguration} from "./i-cluster-testing-configuration";

export class ClusterUnderTestReferencer implements IClusterUnderTestReferencer {
    private _clusterUnderTest:ICluster;

    constructor(
        private _process:IProcess
    ) {}

    set clusterUnderTest(newClusterUnderTest:ICluster) {
        this._clusterUnderTest = newClusterUnderTest;
    }

    get clusterUnderTest(): ICluster {
        return this._clusterUnderTest;
    }

    get clusterId(): string {
        return this._process.environmentVariableNamedOrDefault('clusterId', null);
    }
}
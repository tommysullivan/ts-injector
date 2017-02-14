import {ICluster} from "../clusters/i-cluster";

export interface IClusterUnderTestReferencer {
   clusterUnderTest:ICluster;
   clusterId:string;
   // setClusterUnderTest(value:ICluster);
}
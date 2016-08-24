import IProcess from "../node-js-wrappers/i-process";
import IConsole from "../node-js-wrappers/i-console";
import IThenable from "../promise/i-thenable";
import IClusterUnderTest from "../cluster-testing/i-cluster-under-test";
import IESXIAction from "../esxi/i-esxi-action";
import ClusterTesting from "../cluster-testing/cluster-testing";
import Clusters from "../clusters/clusters";
import ESXIManagedCluster from "../cluster-testing/esxi-managed-cluster";

export default class CliHelper {
    private process:IProcess;
    private console:IConsole;
    private clusterTesting:ClusterTesting;
    private clusters:Clusters;

    constructor(process:IProcess, console:IConsole, clusterTesting:ClusterTesting, clusters:Clusters) {
        this.process = process;
        this.console = console;
        this.clusterTesting = clusterTesting;
        this.clusters = clusters;
    }
    
    logError(e:any):void {
        this.console.log(e.stack ? e.stack : e.toJSONString ? e.toJSONString() : e.toString());
    }

    verifyFillerWord(fillerWord:string, position:number):void {
        const errorMessage = `expected clarifying word "${fillerWord}"`;
        const val = this.process.getArgvOrThrow(errorMessage, position);
        if(fillerWord!=val) throw new Error(`${errorMessage} in position ${position}`);
    }
}
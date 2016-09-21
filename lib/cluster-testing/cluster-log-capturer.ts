import {IClusterUnderTest} from "./i-cluster-under-test";
import {IFuture} from "../promise/i-future";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {INodeUnderTest} from "./i-node-under-test";
import {IList} from "../collections/i-list";
import {IClusterLogCapturer} from "./i-cluster-log-capturer";
import {INodeLog} from "./i-node-log";
import {IClusterTesting} from "./i-cluster-testing";

export class ClusterLogCapturer implements IClusterLogCapturer {
    constructor(
        private mcsLogFileLocation:string,
        private wardenLogLocation:string,
        private configureShLogLocation:string,
        private mfsInitLogFileLocation:string,
        private promiseFactory:IPromiseFactory,
        private clusterTesting:IClusterTesting
    ) {}

    captureLogs(cluster:IClusterUnderTest):IFuture<IList<INodeLog>> {
        const allNodes = cluster.nodes;
        return this.promiseFactory.newGroupPromise(
            this.logsFor(
                allNodes,
                this.wardenLogLocation,
                'Warden Log'
            ).append(
                this.logsFor(
                    allNodes,
                    this.configureShLogLocation,
                    'Configure.sh Log'
                )
            ).append(
                this.logsFor(
                    cluster.nodesHosting('mapr-webserver'),
                    this.mcsLogFileLocation,
                    'MCS Log'
                )
            ).append(
                this.logsFor(
                    allNodes,
                    this.mfsInitLogFileLocation,
                    'MFS Init Log'
                )
            )
        );
    }

    private logsFor(nodes:IList<INodeUnderTest>, logLocation:string, logTitle:string):IList<IFuture<INodeLog>> {
        return nodes.map(node => {
            return node.newSSHSession()
                .then(sshSession => {
                    return sshSession.read(logLocation)
                        .then(logContent=>this.clusterTesting.newNodeLog(
                            node.host,
                            logContent.split("\n"),
                            logTitle
                        ));
                });
        });
    }
}
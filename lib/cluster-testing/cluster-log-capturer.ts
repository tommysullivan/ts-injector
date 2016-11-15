import {IClusterUnderTest} from "./i-cluster-under-test";
import {IFuture} from "../promise/i-future";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {INodeUnderTest} from "./i-node-under-test";
import {IList} from "../collections/i-list";
import {IClusterLogCapturer} from "./i-cluster-log-capturer";
import {INodeLog} from "./i-node-log";
import {IClusterTesting} from "./i-cluster-testing";
import {ICollections} from "../collections/i-collections";
import {ILogCaptureConfiguration} from "./i-log-capture-configuration";

export class ClusterLogCapturer implements IClusterLogCapturer {
    constructor(
        private promiseFactory:IPromiseFactory,
        private clusterTesting:IClusterTesting,
        private collections:ICollections,
        private logsToCapture:Array<ILogCaptureConfiguration>
    ) {}

    captureLogs(cluster:IClusterUnderTest):IFuture<IList<INodeLog>> {
        const configuredLogsList = this.collections.newList(this.logsToCapture);
        const allNodes = cluster.nodes;
        return this.promiseFactory.newGroupPromise(
            configuredLogsList.flatMap(
                configuredLog => this.logsFor(
                    configuredLog.nodesHosting=="all"
                        ? allNodes
                        : cluster.nodesHosting(configuredLog.nodesHosting),
                    configuredLog.location,
                    configuredLog.title
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
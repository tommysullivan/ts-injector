import {ICluster} from "./i-cluster";
import {IFuture} from "../futures/i-future";
import {INode} from "./i-node";
import {IList} from "../collections/i-list";
import {IClusterLogCapturer} from "./i-cluster-log-capturer";
import {INodeLog} from "./i-node-log";
import {IClusterTesting} from "../cluster-testing/i-cluster-testing";
import {ICollections} from "../collections/i-collections";
import {ILogCaptureConfiguration} from "./i-log-capture-configuration";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {IClusters} from "./i-clusters";

export class ClusterLogCapturer implements IClusterLogCapturer {
    constructor(
        private collections:ICollections,
        private fileSystem:IFileSystem,
        private clusters:IClusters
    ) {}

    captureLogs(cluster:ICluster, logsToCapture:Array<ILogCaptureConfiguration>):IFuture<IList<INodeLog>> {
        return this.collections.newList(logsToCapture).flatMapToFutureList(configuredLog =>
            configuredLog.isLocalToTestRunner
                ? this.localLogs(configuredLog.location, configuredLog.title)
                : this.remoteLogsFor(
                    configuredLog.nodesHosting=="all"
                        ? cluster.nodes
                        : cluster.nodesHosting(configuredLog.nodesHosting),
                    configuredLog.location,
                    configuredLog.title
                )
        );
    }

    private localLogs(logLocation:string, logTitle:string):IFuture<IList<INodeLog>> {
        return this.fileSystem.readFile(logLocation)
            .then(logContent => this.collections.newList([
                this.clusters.newNodeLog(
                    'test-runner-host',
                    logContent.split("\n"),
                    logTitle
                )
            ]));
    }

    private remoteLogsFor(nodes:IList<INode>, logLocation:string, logTitle:string):IFuture<IList<INodeLog>> {
        return nodes.mapToFutureList(node =>
            node.newSSHSession()
                .then(session => session.read(logLocation))
                .then(logContent => this.clusters.newNodeLog(
                    node.host,
                    logContent.split("\n"),
                    logTitle
                ))
        );
    }
}
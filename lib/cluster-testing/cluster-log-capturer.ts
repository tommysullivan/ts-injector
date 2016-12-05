import {IClusterUnderTest} from "./i-cluster-under-test";
import {IFuture} from "../futures/i-future";
import {INodeUnderTest} from "./i-node-under-test";
import {IList} from "../collections/i-list";
import {IClusterLogCapturer} from "./i-cluster-log-capturer";
import {INodeLog} from "./i-node-log";
import {IClusterTesting} from "./i-cluster-testing";
import {ICollections} from "../collections/i-collections";
import {ILogCaptureConfiguration} from "./i-log-capture-configuration";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";

export class ClusterLogCapturer implements IClusterLogCapturer {
    constructor(
        private clusterTesting:IClusterTesting,
        private collections:ICollections,
        private logsToCapture:IList<ILogCaptureConfiguration>,
        private fileSystem:IFileSystem
    ) {}

    captureLogs(cluster:IClusterUnderTest):IFuture<IList<INodeLog>> {
        return this.logsToCapture.flatMapToFutureList(configuredLog =>
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
                this.clusterTesting.newNodeLog(
                    'test-runner-host',
                    logContent.split("\n"),
                    logTitle
                )
            ]));
    }

    private remoteLogsFor(nodes:IList<INodeUnderTest>, logLocation:string, logTitle:string):IFuture<IList<INodeLog>> {
        return nodes.mapToFutureList(node =>
            node.newSSHSession()
                .then(session => session.read(logLocation))
                .then(logContent => this.clusterTesting.newNodeLog(
                    node.host,
                    logContent.split("\n"),
                    logTitle
                ))
        );
    }
}
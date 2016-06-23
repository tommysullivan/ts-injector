import IClusterUnderTest from "./i-cluster-under-test";
import IThenable from "../promise/i-thenable";
import IPromiseFactory from "../promise/i-promise-factory";
import NodeLog from "./node-log";
import INodeUnderTest from "./i-node-under-test";
import IList from "../collections/i-list";

export default class ClusterLogCapturer {
    constructor(
        private mcsLogFileLocation:string,
        private wardenLogLocation:string,
        private configureShLogLocation:string,
        private mfsInitLogFileLocation:string,
        private promiseFactory:IPromiseFactory
    ) {}

    captureLogs(cluster:IClusterUnderTest):IThenable<IList<NodeLog>> {
        return this.promiseFactory.newGroupPromise(
            this.logsFor(
                cluster.nodes(),
                this.wardenLogLocation,
                'Warden Log'
            ).append(
                this.logsFor(
                    cluster.nodes(),
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
                    cluster.nodes(),
                    this.mfsInitLogFileLocation,
                    'MFS Init Log'
                )
            )
        );
    }

    private logsFor(nodes:IList<INodeUnderTest>, logLocation:string, logTitle:string):IList<IThenable<NodeLog>> {
        return nodes.map(node => {
            return node.newSSHSession()
                .then(sshSession => {
                    return sshSession.read(logLocation)
                        .then(logContent=>new NodeLog(node.host, logContent.split("\n"), logTitle));
                });
        });
    }
}
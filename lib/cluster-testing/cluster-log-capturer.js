"use strict";
var node_log_1 = require("./node-log");
var ClusterLogCapturer = (function () {
    function ClusterLogCapturer(mcsLogFileLocation, wardenLogLocation, configureShLogLocation, mfsInitLogFileLocation, promiseFactory) {
        this.mcsLogFileLocation = mcsLogFileLocation;
        this.wardenLogLocation = wardenLogLocation;
        this.configureShLogLocation = configureShLogLocation;
        this.mfsInitLogFileLocation = mfsInitLogFileLocation;
        this.promiseFactory = promiseFactory;
    }
    ClusterLogCapturer.prototype.captureLogs = function (cluster) {
        return this.promiseFactory.newGroupPromise(this.logsFor(cluster.nodes(), this.wardenLogLocation, 'Warden Log').append(this.logsFor(cluster.nodes(), this.configureShLogLocation, 'Configure.sh Log')).append(this.logsFor(cluster.nodesHosting('mapr-webserver'), this.mcsLogFileLocation, 'MCS Log')).append(this.logsFor(cluster.nodes(), this.mfsInitLogFileLocation, 'MFS Init Log')));
    };
    ClusterLogCapturer.prototype.logsFor = function (nodes, logLocation, logTitle) {
        return nodes.map(function (node) {
            return node.newSSHSession()
                .then(function (sshSession) {
                return sshSession.read(logLocation)
                    .then(function (logContent) { return new node_log_1.default(node.host, logContent.split("\n"), logTitle); });
            });
        });
    };
    return ClusterLogCapturer;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterLogCapturer;
//# sourceMappingURL=cluster-log-capturer.js.map
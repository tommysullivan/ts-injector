"use strict";
var NodeLog = (function () {
    function NodeLog(nodeHost, logContent, logTitle) {
        this.nodeHost = nodeHost;
        this.logContent = logContent;
        this.logTitle = logTitle;
    }
    NodeLog.prototype.toJSON = function () {
        return {
            logTitle: this.logTitle,
            nodeHost: this.nodeHost,
            logContent: this.logContent,
        };
    };
    return NodeLog;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NodeLog;
//# sourceMappingURL=node-log.js.map
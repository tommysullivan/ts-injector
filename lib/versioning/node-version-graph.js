"use strict";
var NodeVersionGraph = (function () {
    function NodeVersionGraph(host, commandResultSet) {
        this.host = host;
        this.commandResultSet = commandResultSet;
    }
    NodeVersionGraph.prototype.toJSON = function () {
        return {
            host: this.host,
            sshCommandResults: this.commandResultSet.toJSON()
        };
    };
    NodeVersionGraph.prototype.toString = function () {
        return JSON.stringify(this.toJSON(), null, 3);
    };
    return NodeVersionGraph;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NodeVersionGraph;
//# sourceMappingURL=node-version-graph.js.map
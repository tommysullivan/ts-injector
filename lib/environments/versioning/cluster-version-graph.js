module.exports = function(clusterId, versionGraphs) {
    return {
        toString: function() {
            return JSON.stringify(this.toJSON(), null, 3);
        },
        toJSON: function() {
            return {
                clusterId: clusterId,
                nodeLevelGraphs: versionGraphs.map(v=>v.toJSON())
            }
        }
    }
}
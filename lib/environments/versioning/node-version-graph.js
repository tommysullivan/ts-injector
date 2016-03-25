module.exports = function(host, commandResultSet) {
    return {
        toJSON: function() {
            return {
                host: host,
                sshCommandResults: commandResultSet.toJSON()
            }
        },
        toString: function() {
            return JSON.stringify(this.toJSON(), null, 3);
        }
    }
}
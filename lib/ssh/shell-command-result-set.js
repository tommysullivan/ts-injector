module.exports = function(requestedCommands, commandResults) {
    return {
        toString: function() {
            return JSON.stringify(this.toJSON(), null, 3);
        },
        resultNumber: function(indexNumberStartingAtOne) {
            return commandResults[indexNumberStartingAtOne-1];
        },
        toJSON: function() {
            return {
                requestedCommands: requestedCommands,
                commandResults: commandResults.map(c=>c.toJSON())
            }
        }
    }
}
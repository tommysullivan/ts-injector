module.exports = function(api, esxiClient, nodeConfiguration, _, nodeUnderTest) {
    function stateConfigWithName(stateName) {
        return _.findWhere(nodeConfiguration.states, {name: stateName});
    }
    return {
        revertToState: stateName => {
            return api.newPromise((resolve, reject) => {
                var state = stateConfigWithName(stateName);
                if(state==null) reject(new Error(`Invalid state requested for node ${nodeConfiguration.name}. Requested State Name: ${stateName}`));
                else if(state.snapshotId==null) reject(new Error(`Requested state for node ${nodeConfiguration.name} had no snapshotID. Requested State Name: ${stateName}`));
                esxiClient.restoreSnapshot(nodeConfiguration.esxiId, state.snapshotId)
                    .then(() => esxiClient.powerOn(nodeConfiguration.esxiId))
                    .done(resolve, reject);
            });
        },
        deleteStateIfExists: (stateName) => {
            return api.newPromise((resolve, reject) => {
                var state = stateConfigWithName(stateName);
                if(state == null || state.snapshotId == null) resolve(`not deleting, state ${stateName} is not defined in configuration for host ${this.host()}`);
                else {
                    //TODO: Implement a check that the snapshot actually exists before attempting delete
                    esxiClient.removeSnapshot(nodeConfiguration.esxiId, state.snapshotId)
                        .done(resolve, reject);
                }
            });
        },
        captureStateAsSnapshot: function(snapshotName) {
            return esxiClient.captureStateAsSnapshot(nodeConfiguration.esxiId, snapshotName);
        },
        snapshotInfo: function() {
            return esxiClient.snapshotInfo(nodeConfiguration.esxiId);
        },
        executeShellCommands: nodeUnderTest.executeShellCommands.bind(nodeUnderTest),
        verifyMapRNotInstalled: nodeUnderTest.verifyMapRNotInstalled.bind(nodeUnderTest),
        isHostingService: nodeUnderTest.isHostingService.bind(nodeUnderTest),
        host: nodeUnderTest.host.bind(nodeUnderTest),
        username: nodeUnderTest.username.bind(nodeUnderTest),
        password: nodeUnderTest.password.bind(nodeUnderTest),
        operatingSystem: nodeUnderTest.operatingSystem.bind(nodeUnderTest),
        packageCommand: nodeUnderTest.packageCommand.bind(nodeUnderTest),
        repositoryURLFor: nodeUnderTest.repositoryURLFor.bind(nodeUnderTest),
        urlFor: nodeUnderTest.urlFor.bind(nodeUnderTest),
    }
}
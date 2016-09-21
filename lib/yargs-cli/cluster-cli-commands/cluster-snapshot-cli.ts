import yargs = require("../../typings/yargs");

export const command = 'snapshot';
export const desc = 'manage snapshot / state of cluster';
export const builder = (yargs) => {
    return yargs.commandDir('cluster-snapshot-cli-commands').demand(1).help('h');
};
export const handler = (argv) => {};

// info for [clusterId]                         list snapshot info for the cluster',
// 'capture [snapshotName] from [clusterId]      captures snapshot for cluster, then runs "info" command',
//     'apply [stateName] onto [clusterId]           applies snapshots defined by "stateName" to cluster',
//     'delete [stateName] from [clusterId]          deletes snapshots defined by "stateName" from cluster',
//     '',
//     'NOTE: snapshotName is different from stateName!'
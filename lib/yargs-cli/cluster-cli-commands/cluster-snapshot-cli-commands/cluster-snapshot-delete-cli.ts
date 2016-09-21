import {NodeFrameworkLoader} from "../../../framework/node-framework-loader";

export const command = 'delete';
export const desc = 'deletes snapshots defined by "stateName" from cluster';
export const builder = {
    clusterId: {
        alias: 'c',
        type: 'string',
        demand: true,
        describe: 'Cluster ID in config file'
    },
    stateName: {
        alias: 's',
        type: 'string',
        demand: true,
        describe: 'Snapshot state name'
    }
};
export const handler = (argv) => {
    var nodeFrameworkLoader = new NodeFrameworkLoader();
    nodeFrameworkLoader.loadFramework().cli.newExecutor().runClusterSanpshotDeleteCli(argv.clusterId, argv.stateName);
};
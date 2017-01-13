import {frameworkForNodeJSInstance} from "../../../framework/nodejs/framework-for-node-js-instance";

export const command = 'apply';
export const desc = 'applies snapshots defined by "stateName" to cluster';
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
    frameworkForNodeJSInstance.cli.newExecutor().runClusterSanpshotApplyCli(argv.clusterId, argv.stateName);
};
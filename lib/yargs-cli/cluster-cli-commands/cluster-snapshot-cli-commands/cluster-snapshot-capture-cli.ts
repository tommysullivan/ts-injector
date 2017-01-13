import {frameworkForNodeJSInstance} from "../../../framework/nodejs/framework-for-node-js-instance";

export const command = 'capture';
export const desc = `captures snapshot for cluster, then runs "info" command'`;
export const builder = {
    clusterId: {
        alias: 'c',
        type: 'string',
        demand: true,
        describe: 'Cluster ID in config file'
    },
    snapshotName: {
        alias: 's',
        type: 'string',
        demand: true,
        describe: 'Snapshot state name'
    }
};
export const handler = (argv) => {
    frameworkForNodeJSInstance.cli.newExecutor().runClusterSanpshotCaptureCli(argv.clusterId, argv.snapshotName);
};
import {frameworkForNodeJSInstance} from "../../../framework/nodejs/framework-for-node-js-instance";

export const command = 'states';
export const desc = 'list states already captured for the cluster';
export const builder = {
    clusterId: {
        alias: 'c',
        type: 'string',
        demand: true,
        describe: 'Cluster ID in config file'
    }
};
export const handler = (argv) => {
    frameworkForNodeJSInstance.cli.newExecutor().runClusterSanpshotStatesCli(argv.clusterId);
};
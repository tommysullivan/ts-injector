import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";

export const command = 'config';
export const desc = 'yields configuration for specified cluster';
export const builder = {
    clusterId: {
        alias: 'c',
        type: 'string',
        demand: true,
        describe: 'Cluster ID in config file'
    }
};
export const handler = (argv) => {
    frameworkForNodeJSInstance.cli.newExecutor().runShowConfigForCluster(argv.clusterId);
};
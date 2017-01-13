import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";

export const command = 'hosts';
export const desc = 'yields package / os version info for specified cluster';
export const builder = {
    clusterId: {
        alias: 'c',
        type: 'string',
        demand: true,
        describe: 'Cluster ID in config file'
    }
};
export const handler = (argv) => {
    frameworkForNodeJSInstance.cli.newExecutor().runShowHostsForCluster(argv.clusterId);
};
import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";

export const command = 'power';
export const desc = 'reset cluster power or turn it off or on';
export const builder = {
    action: {
        alias: 'a',
        type: 'string',
        demand: true,
        describe: 'Action to perform on|off|reset'
    },
    clusterId: {
        alias: 'c',
        type: 'string',
        demand: true,
        describe: 'Cluster ID to perform action'
    }
};
export const handler = (argv) => {
    frameworkForNodeJSInstance.cli.newExecutor().runPowerForCluster(argv.action, argv.clusterId);
};
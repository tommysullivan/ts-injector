import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";

export const command = 'command';
export const desc = 'run arbitrary command on each node in cluster(s). ' +
    'If environment variable "nodesWith" is set to a comma separated list of service names, ' +
    'then commands will only run on nodes that have those';
export const builder = {};
export const handler = (argv) => {
    frameworkForNodeJSInstance.cli.newExecutor().runCommand(argv);
};

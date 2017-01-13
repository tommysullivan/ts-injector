import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";

export const command = 'generate';
export const desc = 'Generate the cluster JSON for the node';
export const builder = {};
export const handler = (argv) => {
    frameworkForNodeJSInstance.cli.newExecutor().runClusterGenerator();
};

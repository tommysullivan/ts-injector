import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";

export const command = 'ids';
export const desc = 'list available cluster ids';
export const builder = {};
export const handler = (argv) => {
    frameworkForNodeJSInstance.cli.newExecutor().runShowClusterIds();
};

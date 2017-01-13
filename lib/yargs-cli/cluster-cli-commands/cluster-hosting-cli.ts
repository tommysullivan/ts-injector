import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";

export const command = 'hosting';
export const desc = 'yields cluster ids containing specified host';
export const builder = {
    hostname: {
        alias: 'ho',
        type: 'string',
        demand: true,
        describe: 'HostName of machine'
    }
};
export const handler = (argv) => {
    frameworkForNodeJSInstance.cli.newExecutor().runshowNodesHostingService(argv.hostname);
};
import {NodeFrameworkLoader} from "../../framework/node-framework-loader";

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
    var nodeFrameworkLoader = new NodeFrameworkLoader();
    nodeFrameworkLoader.loadFramework().cli.newExecutor().runshowNodesHostingService(argv.hostname);
};
import {NodeFrameworkLoader} from "../../../framework/node-framework-loader";

export const command = 'info';
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
    var nodeFrameworkLoader = new NodeFrameworkLoader();
    nodeFrameworkLoader.loadFramework().cli.newExecutor().runClusterSanpshotInfoCli(argv.clusterId);
};
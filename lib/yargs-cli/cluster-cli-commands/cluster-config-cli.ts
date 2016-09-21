import {NodeFrameworkLoader} from "../../framework/node-framework-loader";

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
    var nodeFrameworkLoader = new NodeFrameworkLoader();
    nodeFrameworkLoader.loadFramework().cli.newExecutor().runShowConfigForCluster(argv.clusterId);
};
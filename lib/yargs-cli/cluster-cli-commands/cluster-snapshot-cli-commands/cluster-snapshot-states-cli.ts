import {NodeFrameworkLoader} from "../../../framework/node-framework-loader";

export const command = 'states';
export const desc = 'list states already captured for the cluster';
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
    nodeFrameworkLoader.loadFramework().cli.newExecutor().runClusterSanpshotStatesCli(argv.clusterId);
};
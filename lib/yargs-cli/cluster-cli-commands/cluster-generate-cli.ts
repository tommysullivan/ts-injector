import {NodeFrameworkLoader} from "../../framework/node-framework-loader";

export const command = 'generate';
export const desc = 'Generate the cluster JSON for the node';
export const builder = {};
export const handler = (argv) => {
    var nodeFrameworkLoader = new NodeFrameworkLoader();
    nodeFrameworkLoader.loadFramework().cli.newExecutor().runClusterGenerator();
};

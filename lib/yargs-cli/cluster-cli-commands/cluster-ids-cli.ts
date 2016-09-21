import {NodeFrameworkLoader} from "../../framework/node-framework-loader";

export const command = 'ids';
export const desc = 'list available cluster ids';
export const builder = {};
export const handler = (argv) => {
    var nodeFrameworkLoader = new NodeFrameworkLoader();
    nodeFrameworkLoader.loadFramework().cli.newExecutor().runShowClusterIds();
};

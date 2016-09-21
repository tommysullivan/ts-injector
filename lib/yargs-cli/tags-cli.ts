import {NodeFrameworkLoader} from "../framework/node-framework-loader";

export const command = 'tags';
export const desc = 'list available cucumber tags';
export const builder = {};
export const handler = (argv) => {
    var nodeFrameworkLoader = new NodeFrameworkLoader();
    nodeFrameworkLoader.loadFramework().cli.newExecutor().runExecuteTagsCli();
};

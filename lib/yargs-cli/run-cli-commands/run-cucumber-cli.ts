import {NodeFrameworkLoader} from "../../framework/node-framework-loader";

export const command = 'cucumber';
export const desc = 'args passed thru to cucumber.js';
export const builder = {};
export const handler = (argv) => {
    var nodeFrameworkLoader = new NodeFrameworkLoader();
    nodeFrameworkLoader.loadFramework().cli.newExecutor().runCucumberCommand(argv);
};

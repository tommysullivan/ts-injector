import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";

export const command = 'cucumber';
export const desc = 'args passed thru to cucumber.js';
export const builder = {};
export const handler = (argv) => {
    frameworkForNodeJSInstance.cli.newExecutor().runCucumberCommand(argv);
};

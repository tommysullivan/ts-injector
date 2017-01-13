import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";
// declare const require:any;
// var exec = require('child_process').exec;

export const command = 'install';
export const desc = 'install MapR on the cluster';
export const builder = {
    secure: {
        alias: 's',
        type: 'boolean',
        demand: false,
        describe: 'True if secure cluster'
    }
};
export const handler = (argv) => {
    frameworkForNodeJSInstance.cli.newExecutor().runInstallCommand(argv.secure);
};

import {NodeFrameworkLoader} from "../../framework/node-framework-loader";
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
    var nodeFrameworkLoader = new NodeFrameworkLoader();
    nodeFrameworkLoader.loadFramework().cli.newExecutor().runInstallCommand(argv.secure);
};

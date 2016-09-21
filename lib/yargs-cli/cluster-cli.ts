import yargs = require("../typings/yargs");

export const command = 'cluster';
export const desc = 'manage the cluster under test';
export const builder = (yargs) => {
    return yargs.commandDir('cluster-cli-commands').demand(1).help('h');
};
export const handler = (argv) => {
};

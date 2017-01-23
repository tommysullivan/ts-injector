import yargs = require("../typings/yargs");

export const command = 'docker';
export const desc = 'Run Docker Commands';
export const builder = (yargs) => {
    return yargs.commandDir('docker-cli-commands').demand(1).help('h');
};
export const handler = (argv) => {
};

import yargs = require("../typings/yargs");

export const command = 'run';
export const desc = 'Execute some tests';
export const builder = (yargs) => {
    return yargs.commandDir('run-cli-commands').demand(1).help('h');
};
export const handler = (argv) => {
};

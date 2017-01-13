import {frameworkForNodeJSInstance} from "../framework/nodejs/framework-for-node-js-instance";

export const command = 'featureSets';
export const desc = 'list runnable featureSets, detail to true/false';
export const builder = {
    detail: {
        alias: 'd',
        default: false,
        type: 'boolean',
        describe: 'show details of each featureSet in addition to the name'
    }
};
export const handler = (argv) => {
    frameworkForNodeJSInstance.cli.newExecutor().executeShowFeatureSets(argv.detail);
};

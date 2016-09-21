import {NodeFrameworkLoader} from "../framework/node-framework-loader";

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
    var nodeFrameworkLoader = new NodeFrameworkLoader();
    nodeFrameworkLoader.loadFramework().cli.newExecutor().executeShowFeatureSets(argv.detail);
};

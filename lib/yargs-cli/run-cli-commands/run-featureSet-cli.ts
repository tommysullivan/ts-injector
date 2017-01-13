import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";

export const command = 'featureSet';
export const desc = 'run cucumber with the specified featureset (to list available run command "featureSets")';
export const builder = {
    featureSetId: {
        alias: 'f',
        type: 'string',
        demand: true,
        describe: 'Feature set ID in config file'
    }
};
export const handler = (argv) => {
    frameworkForNodeJSInstance.cli.newExecutor().runFeatureSetId(argv.featureSetId, argv);
};

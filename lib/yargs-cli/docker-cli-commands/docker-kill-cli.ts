import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";
export const command = 'kill';
export const desc = 'Kill any previously launched docker image';
export const builder = {
    clusterId: {
        alias: 'c',
        type: 'string',
        demand: true,
        describe: 'Cluster id for the on-demand cluster'
    }
};
export const handler = (argv) => {
    frameworkForNodeJSInstance.cli.newDockerCliHelper().destroyCluster(argv.clusterId);
};
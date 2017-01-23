import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";

export const command = 'launch';
export const desc = 'Launch a docker image specified in env variable dockerId';
export const builder = {
    dockerId: {
        alias: 'd',
        type: 'string',
        demand: false,
        describe: 'Docker Image name'
    }
};
export const handler = (argv) => {
    frameworkForNodeJSInstance.cli.newExecutor().runDockerLauncher(argv.dockerId);
};
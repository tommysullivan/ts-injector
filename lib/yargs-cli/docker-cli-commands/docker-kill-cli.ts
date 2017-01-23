import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";
export const command = 'kill';
export const desc = 'Kill any previously launched docker image';
export const builder = {
    dockerId: {
        alias: 'd',
        type: 'string',
        demand: true,
        describe: 'Docker Image name'
    }
};
export const handler = (argv) => {
    frameworkForNodeJSInstance.cli.newExecutor().runKillDockerImage(argv.dockerId);
};
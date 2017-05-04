import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";

export const command = 'launch';
export const desc = 'Launch a docker image specified in env variable dockerClusterTemplateId';
export const builder = {
    dockerClusterTemplateId: {
        alias: 'd',
        type: 'string',
        demand: true,
        describe: 'Docker Template Id (from config.json)'
    },
    mesosEnvironmentId: {
        alias: 'e',
        type: 'string',
        demand: true,
        describe: 'Mesos Environment Id (from config.json)'
    }
};
export const handler = (argv) => {
    frameworkForNodeJSInstance.cli.newDockerCliHelper().provisionCluster(argv.dockerClusterTemplateId, argv.mesosEnvironmentId)
        .catch(e => {
            console.log(e);
            process.exit(1);
        });
};
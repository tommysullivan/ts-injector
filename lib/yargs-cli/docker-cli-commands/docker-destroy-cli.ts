import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";
export const command = 'destroy';
export const desc = 'Destroy all launched apps';
export const builder = {
    envId: {
        alias: 'e',
        type: 'string',
        demand: true,
        describe: 'Environment id to destroy all apps'
    }
};
export const handler = (argv) => {
    frameworkForNodeJSInstance.cli.newDockerCliHelper().destroyAllApplications(argv.envId);
};
import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";

export const command = 'environmentIds';
export const desc = 'List all Environments';
export const builder = {};

export const handler = () => {
    frameworkForNodeJSInstance.cli.newDockerCliHelper().listAllEnvironments()
};
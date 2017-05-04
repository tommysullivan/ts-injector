import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";

export const command = 'templateIds';
export const desc = 'List all templates';
export const builder = {};

export const handler = () => {
    frameworkForNodeJSInstance.cli.newDockerCliHelper().listAllClusterTemplates()
};
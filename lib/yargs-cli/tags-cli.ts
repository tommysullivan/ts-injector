import {frameworkForNodeJSInstance} from "../framework/nodejs/framework-for-node-js-instance";

export const command = 'tags';
export const desc = 'list available cucumber tags';
export const builder = {};
export const handler = _ => {
    frameworkForNodeJSInstance.cli.newExecutor().runExecuteTagsCli();
};

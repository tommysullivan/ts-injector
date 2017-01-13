import {IFramework} from "../common/i-framework";
import {FrameworkForNodeJS} from "./framework-for-node-js";

declare const process:any;
declare const require:any;

export const frameworkForNodeJSInstance:IFramework = new FrameworkForNodeJS(require, process);
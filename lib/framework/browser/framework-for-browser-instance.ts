import {IFramework} from "../common/i-framework";
import {FrameworkForBrowser} from "./framework-for-browser";

declare const console:any;
declare const Promise:any;
declare const $:any;

export const frameworkForBrowserInstance:IFramework = new FrameworkForBrowser(console, Promise, $);
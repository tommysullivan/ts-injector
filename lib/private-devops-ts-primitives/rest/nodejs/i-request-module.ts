import {INativeServerRequestor} from "./i-native-server-requestor";
import {IDefaultOptions} from "./i-default-options";

export interface INativeServerRequestModule {
    debug:boolean;
    defaults(options:IDefaultOptions):INativeServerRequestor;
}
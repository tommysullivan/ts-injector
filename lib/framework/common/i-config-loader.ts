import {IFrameworkConfiguration} from "./i-framework-configuration";

export interface IConfigLoader {
    loadConfig():IFrameworkConfiguration;
}
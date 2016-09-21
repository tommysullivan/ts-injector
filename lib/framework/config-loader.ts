import {IProcess} from "../node-js-wrappers/i-process";
import {FrameworkConfiguration} from "./framework-configuration";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {IPath} from "../node-js-wrappers/i-path";
import {ICollections} from "../collections/i-collections";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IJSONObject} from "../typed-json/i-json-object";
import {IJSONMerger} from "../typed-json/i-json-merger";
import {IConfigLoader} from "./i-config-loader";
import {IFrameworkConfiguration} from "./i-framework-configuration";

declare const require:any;

export class ConfigLoader implements IConfigLoader {
    private CONFIG_PATH_ENV_VAR_NAME = 'configPath';
    private DEFAULT_CONFIG_PATH = 'configuration/config.json';

    constructor(
        private process:IProcess,
        private fileSystem:IFileSystem,
        private path:IPath,
        private collections:ICollections,
        private typedJson:ITypedJSON,
        private jsonMerger:IJSONMerger
    ) {}

    loadConfig():IFrameworkConfiguration {
        return new FrameworkConfiguration(
            this.mergedJsonFile,
            this.basePathToUseForConfiguredRelativePaths,
            this.path,
            this.process,
            this.collections
        );
    }

    private get mergedJsonFile():IJSONObject {
        const configFile = require("private-devops-configuration/devops-configuration/config.json");
        const copiedJsonConfig = JSON.parse(JSON.stringify(configFile));

        const mergedWithDefaultJSON = this.fileSystem.checkFileExistSync(this.DEFAULT_CONFIG_PATH)
            ? this.jsonMerger.mergeJSON(
                copiedJsonConfig,
                this.fileSystem.readJSONObjectFileSync(this.DEFAULT_CONFIG_PATH).toJSON()
            ) : copiedJsonConfig;

        const finalJson = this.configPath
            ? this.jsonMerger.mergeJSON(
                mergedWithDefaultJSON,
                this.fileSystem.readJSONObjectFileSync(this.configPath).toJSON()
            ) : mergedWithDefaultJSON;

        return this.typedJson.newJSONObject(finalJson);
    }

    private get basePathToUseForConfiguredRelativePaths():string {
        return this.path.dirname(this.configPath);
    }

    private get configPath():string {
        return this.process.environmentVariables.hasKey(this.CONFIG_PATH_ENV_VAR_NAME)
            ? this.process.environmentVariableNamed(this.CONFIG_PATH_ENV_VAR_NAME)
            : null;
    }
}
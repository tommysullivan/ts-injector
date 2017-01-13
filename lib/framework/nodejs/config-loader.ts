import {IProcess} from "../../node-js-wrappers/i-process";
import {FrameworkConfiguration} from "../common/framework-configuration";
import {IFileSystem} from "../../node-js-wrappers/i-filesystem";
import {IPath} from "../../node-js-wrappers/i-path";
import {ICollections} from "../../collections/i-collections";
import {ITypedJSON} from "../../typed-json/i-typed-json";
import {IJSONObject} from "../../typed-json/i-json-object";
import {IJSONMerger} from "../../typed-json/i-json-merger";
import {IConfigLoader} from "../common/i-config-loader";
import {IFrameworkConfiguration} from "../common/i-framework-configuration";
import {IJSONValue, IJSONHash} from "../../typed-json/i-json-value";
import {IJSONParser} from "../../typed-json/i-json-parser";

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
        private jsonMerger:IJSONMerger,
        private jsonParser:IJSONParser
    ) {}

    loadConfig():IFrameworkConfiguration {
        return new FrameworkConfiguration(
            this.mergedJsonFile,
            this.basePathToUseForConfiguredRelativePaths,
            this.path,
            this.process,
            this.collections,
            this.fileSystem
        );
    }

    private configWithDynamicValues(originalJSONString:string):string {
        return originalJSONString.replace(
            /\$\{(.*?)\}/g,
            (match, variableExpression) => {
                const locationOfBar = variableExpression.indexOf('|');
                return locationOfBar > -1
                    ? this.process.environmentVariableNamedOrDefault(
                        variableExpression.substring(0,locationOfBar),
                        variableExpression.substring(locationOfBar+1)
                    )
                    : this.process.environmentVariableNamed(variableExpression);
            }
        );
    }

    private readAndParseConfigFile(path:string):IJSONValue {
        return this.jsonParser.parse(this.configWithDynamicValues(
            this.fileSystem.readFileSync(path)
        ))
    }

    private get mergedJsonFile():IJSONObject {
        const configFile = require("private-devops-configuration/devops-configuration/config.json");
        const configFileAsString = JSON.stringify(configFile);
        const copiedJsonConfig = this.jsonParser.parse(this.configWithDynamicValues(configFileAsString));
        const mergedWithDefaultJSON = this.fileSystem.checkFileExistSync(this.DEFAULT_CONFIG_PATH)
            ? this.jsonMerger.mergeJSON(
                copiedJsonConfig,
                this.readAndParseConfigFile(this.DEFAULT_CONFIG_PATH)
            )
            : copiedJsonConfig;

        const finalJson = this.configPath
            ? this.jsonMerger.mergeJSON(
                mergedWithDefaultJSON,
                this.readAndParseConfigFile(this.configPath)
            )
            : mergedWithDefaultJSON;

        return this.typedJson.newJSONObject(<IJSONHash> finalJson);
    }

    private get basePathToUseForConfiguredRelativePaths():string {
        return this.configPath 
            ? this.path.dirname(this.configPath)
            : this.path.dirname('package.json');
    }

    private get configPath():string {
        return this.process.environmentVariables.hasKey(this.CONFIG_PATH_ENV_VAR_NAME)
            ? this.process.environmentVariableNamed(this.CONFIG_PATH_ENV_VAR_NAME)
            : null;
    }
}

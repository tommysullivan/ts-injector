import IProcess from "../node-js-wrappers/i-process";
import FrameworkConfiguration from "./framework-configuration";
import IFileSystem from "../node-js-wrappers/i-filesystem";
import IPath from "../node-js-wrappers/i-path";

export default class ConfigLoader {
    private DEFAULT_CONFIG_PATH:string = 'configuration/config.json';
    private CONFIG_PATH_ENV_VAR_NAME = 'configPath';

    private process:IProcess;
    private fileSystem:IFileSystem;
    private path:IPath;

    constructor(process:IProcess, fileSystem:IFileSystem, path:IPath) {
        this.process = process;
        this.fileSystem = fileSystem;
        this.path = path;
    }

    loadConfig():FrameworkConfiguration {
        return new FrameworkConfiguration(
            this.fileSystem.readJSONObjectFileSync(this.configPath),
            this.basePathToUseForConfiguredRelativePaths,
            this.path,
            this.process
        );
    }

    get basePathToUseForConfiguredRelativePaths():string {
        return this.path.dirname(this.configPath);
    }

    get configPath():string {
        //TODO: Make sure the default regardless of the cwd.
        return this.process.environmentVariables().hasKey(this.CONFIG_PATH_ENV_VAR_NAME)
            ? this.process.environmentVariableNamed(this.CONFIG_PATH_ENV_VAR_NAME)
            : this.DEFAULT_CONFIG_PATH;
    }
}
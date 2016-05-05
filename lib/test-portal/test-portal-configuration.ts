import IJSONObject from "../typed-json/i-json-object";
import IPath from "../node-js-wrappers/i-path";
import IProcess from "../node-js-wrappers/i-process";

export default class TestPortalConfiguration {
    private configJSON:IJSONObject;
    private basePathToUseForConfiguredRelativePaths:string;
    private path:IPath;
    private process:IProcess;

    constructor(configJSON:IJSONObject, basePathToUseForConfiguredRelativePaths:string, path:IPath, process:IProcess) {
        this.configJSON = configJSON;
        this.basePathToUseForConfiguredRelativePaths = basePathToUseForConfiguredRelativePaths;
        this.path = path;
        this.process = process;
    }

    private get portalId():string { return this.process.environmentVariableNamedOrDefault('portalId', 'local'); }
    private get envSpecificConfig():IJSONObject { return this.configJSON.jsonObjectNamed('environmentSpecificConfig').jsonObjectNamed(this.portalId); }

    get testResultsWebRoute():string { return this.configJSON.stringPropertyNamed('testResultsWebRoute'); }
    get testResultWebRoute():string { return this.configJSON.stringPropertyNamed('testResultWebRoute'); }
    get testConfigWebRouteRoute():string { return this.configJSON.stringPropertyNamed('testConfigWebRouteRoute'); }
    get testCliInvocationsWebRoute():string { return this.configJSON.stringPropertyNamed('testCliInvocationsWebRoute'); }
    get jqlQueryWebRoute():string { return this.configJSON.stringPropertyNamed('jqlQueryWebRoute'); }
    get jiraSyncRequestWebRoute():string { return this.configJSON.stringPropertyNamed('jiraSyncRequestWebRoute'); }
    get requestSizeLimitInMegabytes():number { return this.configJSON.numericPropertyNamed('requestSizeLimitInMegabytes'); }
    get httpPort():number { return this.envSpecificConfig.numericPropertyNamed('httpPort'); }
    get hostName():string { return this.envSpecificConfig.stringPropertyNamed('hostName');  }
    get maxResultsForExplorer():number { return this.configJSON.numericPropertyNamed('maxResultsForExplorer'); }
    get fullyQualifiedConfigsPath():string { throw new Error('not impl'); }
    get fullyQualifiedCLIInvocationsPath():string { throw new Error('not impl'); }
    get fullyQualifiedResultsPath():string {
        return this.path.join(this.basePathToUseForConfiguredRelativePaths, this.configJSON.stringPropertyNamed('testResultPathRelativeToThisConfigFile'));
    }
}
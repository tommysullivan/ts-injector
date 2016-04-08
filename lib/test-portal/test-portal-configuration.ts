import IJSONObject from "../typed-json/i-json-object";
import IPath from "../node-js-wrappers/i-path";

export default class TestPortalConfiguration {
    private configJSON:IJSONObject;
    private basePathToUseForConfiguredRelativePaths:string;
    private path:IPath;

    constructor(configJSON:IJSONObject, basePathToUseForConfiguredRelativePaths:string, path:IPath) {
        this.configJSON = configJSON;
        this.basePathToUseForConfiguredRelativePaths = basePathToUseForConfiguredRelativePaths;
        this.path = path;
    }

    get testResultsWebRoute():string { return this.configJSON.stringPropertyNamed('testResultsWebRoute'); }
    get testResultWebRoute():string { return this.configJSON.stringPropertyNamed('testResultWebRoute'); }
    get testConfigWebRouteRoute():string { return this.configJSON.stringPropertyNamed('testConfigWebRouteRoute'); }
    get testCliInvocationsWebRoute():string { return this.configJSON.stringPropertyNamed('testCliInvocationsWebRoute'); }
    get jqlQueryWebRoute():string { return this.configJSON.stringPropertyNamed('jqlQueryWebRoute'); }
    get jiraSyncRequestWebRoute():string { return this.configJSON.stringPropertyNamed('jiraSyncRequestWebRoute'); }
    
    get requestSizeLimitInMegabytes():number { return this.configJSON.numericPropertyNamed('requestSizeLimitInMegabytes'); }
    get httpPort():number { return this.configJSON.numericPropertyNamed('httpPort'); }
    get hostName():string { return this.configJSON.stringPropertyNamed('hostName'); }
    get maxResultsForExplorer():number { return this.configJSON.numericPropertyNamed('maxResultsForExplorer'); }

    get fullyQualifiedResultsPath():string {
        return this.path.join(this.basePathToUseForConfiguredRelativePaths, this.configJSON.stringPropertyNamed('testResultPathRelativeToThisConfigFile'));
    }

    get fullyQualifiedConfigsPath():string { throw new Error('not impl'); }
    get fullyQualifiedCLIInvocationsPath():string { throw new Error('not impl'); }
}
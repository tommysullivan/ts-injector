import TestPortalConfiguration from "../test-portal-configuration";
import IHttpRequest from "../../http/i-http-request";
import IPath from "../../node-js-wrappers/i-path";

export default class FilePathHelper {
    private testPortalConfiguration:TestPortalConfiguration;
    private path:IPath;

    constructor(testPortalConfiguration:TestPortalConfiguration, path:IPath) {
        this.testPortalConfiguration = testPortalConfiguration;
        this.path = path;
    }

    getTestResultFilePathFromId(resultId):string {
        return this.path.join(this.testPortalConfiguration.fullyQualifiedResultsPath, `${resultId}.json`);
    }

    getTestConfigFilePathFromId(configId):string {
        return this.path.join(this.testPortalConfiguration.fullyQualifiedConfigsPath, `${configId}.json`);
    }

    getTestCliInvocationFilePathFromId(cliDetailId):string {
        return this.path.join(this.testPortalConfiguration.fullyQualifiedCLIInvocationsPath, `${cliDetailId}.txt`);
    }

    getTestResultFilePathFromHttpRequest(httpRequest:IHttpRequest):string {
        return this.getTestResultFilePathFromId(httpRequest.params.getOrThrow('resultId'));
    }

    getTestConfigFilePathFromHttpRequest(httpRequest:IHttpRequest):string {
        return this.getTestConfigFilePathFromId(httpRequest.params.getOrThrow('configId'));
    }

    getTestCliInvocationsFilePathFromHttpRequest(httpRequest:IHttpRequest):string {
        return this.getTestCliInvocationFilePathFromId(httpRequest.params.getOrThrow('cliDetailId'));
    }
}
import IHttpRequest from "../../http/i-http-request";
import IHttpResponse from "../../http/i-http-response";
import BaseExpressController from "../../express-wrappers/base-express-controller";
import IFileSystem from "../../node-js-wrappers/i-filesystem";
import FilePathHelper from "../models/file-path-helper";
import ErrorHandler from "./error-handler";

export default class TestResultController extends BaseExpressController {
    private fs:IFileSystem;
    private filePathHelper:FilePathHelper;
    private errorHandler:ErrorHandler;
    private contentTypeThatTransformsToDesiredContentType:string = 'vnd/mapr.test-portal.cluster-test-result+json;v=2.0.0';

    constructor(fs:IFileSystem, filePathHelper:FilePathHelper, errorHandler:ErrorHandler) {
        super();
        this.fs = fs;
        this.filePathHelper = filePathHelper;
        this.errorHandler = errorHandler;
    }

    get(httpRequest:IHttpRequest, httpResponse:IHttpResponse):void {
        if(httpRequest.accepts('text/html'))
            httpResponse.redirect(`/#/test-result-viewer/${httpRequest.params.getOrThrow('resultId')}`);
        else {
            var filePath = this.filePathHelper.getTestResultFilePathFromHttpRequest(httpRequest);
            if(this.shouldAttemptTransform(httpRequest, filePath)) {
                this.getTestResultSummary(httpRequest, httpResponse, filePath);
            } else {
                this.fs.createReadStream(
                    this.filePathHelper.getTestResultFilePathFromHttpRequest(httpRequest)
                ).pipe(httpResponse);
            }
        }
    }

    private shouldAttemptTransform(httpRequest:IHttpRequest, filePath:string):boolean {
        if(httpRequest.accepts('vnd/mapr.test-portal.cluster-test-result-summary+json;v=1.0.0')) {
            var testResultJSON = this.fs.readJSONObjectFileSync(filePath);
            var hasContentType = testResultJSON.hasPropertyNamed('contentType');
            var canTransformToContentType = testResultJSON.stringPropertyNamed('contentType') == this.contentTypeThatTransformsToDesiredContentType;
            return canTransformToContentType;
        }
        else return false;
    }

    private getTestResultSummary(httpRequest:IHttpRequest, httpResponse:IHttpResponse, filePath:string):void {
        var testResultJSON = this.fs.readJSONObjectFileSync(filePath);
        var transformedTestResultJSON = {
            contentType: testResultJSON.stringPropertyNamed('contentType'),
            clusterConfiguration: {
                id: testResultJSON.jsonObjectNamed('clusterConfiguration').stringPropertyNamed('id')
            },
            cucumberTestResult: {
                cucumberFeatureResults: testResultJSON.hasPropertyNamed('cucumberTestResult')
                    ? testResultJSON.jsonObjectNamed('cucumberTestResult').listNamed('cucumberFeatureResults').toArray()
                    : []
            }
        }
        httpResponse.end(JSON.stringify(transformedTestResultJSON));
    }


    put(httpRequest:IHttpRequest, httpResponse:IHttpResponse):void {
        try {
            this.fs.writeFileSync(
                this.filePathHelper.getTestResultFilePathFromHttpRequest(httpRequest),
                httpRequest.bodyAsJSONObject.toString()
            );
            httpResponse.sendStatus(200).end('Successfully saved test result');
        }
        catch(error) {
            this.errorHandler.handleError(httpResponse, error);
        }
    }
}
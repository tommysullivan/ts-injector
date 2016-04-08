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

    constructor(fs:IFileSystem, filePathHelper:FilePathHelper, errorHandler:ErrorHandler) {
        super();
        this.fs = fs;
        this.filePathHelper = filePathHelper;
        this.errorHandler = errorHandler;
    }

    get(httpRequest:IHttpRequest, httpResponse:IHttpResponse):void {
        if(httpRequest.accepts('text/html'))
            httpResponse.redirect(`/#/test-result-viewer/${httpRequest.params.getOrThrow('resultId')}`);
        else
            this.fs.createReadStream(
                this.filePathHelper.getTestResultFilePathFromHttpRequest(httpRequest)
            ).pipe(httpResponse);
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
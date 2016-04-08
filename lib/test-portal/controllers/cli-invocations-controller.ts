import BaseExpressController from "../../express-wrappers/base-express-controller";
import IFileSystem from "../../node-js-wrappers/i-filesystem";
import FilePathHelper from "../models/file-path-helper";
import IHttpRequest from "../../http/i-http-request";
import IHttpResponse from "../../http/i-http-response";

export default class CliInvocationsController extends BaseExpressController {
    private fs:IFileSystem;
    private filePathHelper:FilePathHelper;

    constructor(fs:IFileSystem, filePathHelper:FilePathHelper) {
        super();
        this.fs = fs;
        this.filePathHelper = filePathHelper;
    }

    get(httpRequest:IHttpRequest, httpResponse:IHttpResponse):void {
        this.fs.createReadStream(
            this.filePathHelper.getTestCliInvocationsFilePathFromHttpRequest(httpRequest)
        ).pipe(httpResponse);
    }
}
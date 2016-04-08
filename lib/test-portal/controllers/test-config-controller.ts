import BaseExpressController from "../../express-wrappers/base-express-controller";
import IHttpResponse from "../../http/i-http-response";
import IHttpRequest from "../../http/i-http-request";
import IFileSystem from "../../node-js-wrappers/i-filesystem";
import FilePathHelper from "../models/file-path-helper";

export default class TestConfigController extends BaseExpressController {
    private fs:IFileSystem;
    private filePathHelper:FilePathHelper;

    constructor(fs:IFileSystem, filePathHelper:FilePathHelper) {
        super();
        this.fs = fs;
        this.filePathHelper = filePathHelper;
    }

    get(httpRequest:IHttpRequest, httpResponse:IHttpResponse):void {
        this.fs.createReadStream(
            this.filePathHelper.getTestConfigFilePathFromHttpRequest(httpRequest)
        ).pipe(httpResponse);
    }
}
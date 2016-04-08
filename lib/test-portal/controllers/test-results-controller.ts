import IHttpRequest from "../../http/i-http-request";
import IHttpResponse from "../../http/i-http-response";
import BaseExpressController from "../../express-wrappers/base-express-controller";
import IFileSystem from "../../node-js-wrappers/i-filesystem";
import IPath from "../../node-js-wrappers/i-path";
import TestPortal from "../test-portal";

export default class TestResultsController extends BaseExpressController {
    private fs:IFileSystem;
    private maxResults:number;
    private path:IPath;
    private fullyQualifiedResultsPath:string;
    private testPortal:TestPortal;

    constructor(fs:IFileSystem, maxResults:number, path:IPath, fullyQualifiedResultsPath:string, testPortal:TestPortal) {
        super();
        this.fs = fs;
        this.maxResults = maxResults;
        this.path = path;
        this.fullyQualifiedResultsPath = fullyQualifiedResultsPath;
        this.testPortal = testPortal;
    }

    get(httpRequest:IHttpRequest, httpResponse:IHttpResponse):void {
        var fileNames = this.fs.readdirSync(this.fullyQualifiedResultsPath).filter(f=>f.indexOf('.json')>-1);
        var fileDescriptors = fileNames.map(fileName => {
            var fullPath = this.path.join(this.fullyQualifiedResultsPath, fileName);
            var urlFriendlyName = fileName.replace('.json','');
            var fileStats = this.fs.statSync(fullPath);
            return this.testPortal.newTestResultDescriptor(urlFriendlyName, fullPath, fileStats);
        });
        fileDescriptors = fileDescriptors.filter(f=>f.size>0);
        fileDescriptors = fileDescriptors.sortWith((f1, f2) => f1.modifiedTime - f2.modifiedTime);
        fileDescriptors = fileDescriptors.limitTo(this.maxResults);
        httpResponse.end(fileDescriptors.toJSONString());
    }
}
import BaseExpressController from "../../express-wrappers/base-express-controller";
import JiraRestClient from "../../jira/jira-rest-client";
import IPromiseFactory from "../../promise/i-promise-factory";
import IHttpRequest from "../../http/i-http-request";
import IHttpResponse from "../../http/i-http-response";
import ErrorHandler from "./error-handler";
import TestPortal from "../test-portal";

export default class JIRASyncRequestController extends BaseExpressController {
    private jiraRestClient:JiraRestClient;
    private promiseFactory:IPromiseFactory;
    private jiraUsername:string;
    private jiraPassword:string;
    private errorHandler:ErrorHandler;
    private testPortal:TestPortal;

    constructor(jiraRestClient:JiraRestClient, promiseFactory:IPromiseFactory, jiraUsername:string, jiraPassword:string, errorHandler:ErrorHandler, testPortal:TestPortal) {
        super();
        this.jiraRestClient = jiraRestClient;
        this.promiseFactory = promiseFactory;
        this.jiraUsername = jiraUsername;
        this.jiraPassword = jiraPassword;
        this.errorHandler = errorHandler;
        this.testPortal = testPortal;
    }

    post(httpRequest:IHttpRequest, httpResponse:IHttpResponse):void {
        var testResultModels = httpRequest.bodyAsListOfJSONObjects.map(
            testResultJSON => this.testPortal.newTestResultModel(testResultJSON)
        );

        var testResultComments = testResultModels.map(
            testResultModel => this.testPortal.newJiraTestResultComment(testResultModel)
        );

        this.jiraRestClient.createAutheticatedSession(this.jiraUsername, this.jiraPassword)
            .then(jiraSession=>{
                var commentCreationRequests = testResultComments.map(
                    testResultComment=>jiraSession.addCommentToIssue(testResultComment)
                );
                return this.promiseFactory.newGroupPromise(commentCreationRequests);
            })
            .then(_=>httpResponse.end('success'))
            .catch(error=>this.errorHandler.handleError(httpResponse, error));
    }
}
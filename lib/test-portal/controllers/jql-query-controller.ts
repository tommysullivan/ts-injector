import BaseExpressController from "../../express-wrappers/base-express-controller";
import JiraRestClient from "../../jira/jira-rest-client";
import JiraConfiguration from "../../jira/jira-configuration";
import ErrorHandler from "./error-handler";
import IHttpResponse from "../../http/i-http-response";
import IHttpRequest from "../../http/i-http-request";
import Jira from "../../jira/jira";

export default class JQLQueryController extends BaseExpressController {
    private jiraRestClient:JiraRestClient;
    private errorHandler:ErrorHandler;
    private jira:Jira;
    private jiraUsername:string;
    private jiraPassword:string;

    constructor(jiraRestClient:JiraRestClient, errorHandler:ErrorHandler, jira:Jira, jiraUsername:string, jiraPassword:string) {
        super();
        this.jiraRestClient = jiraRestClient;
        this.errorHandler = errorHandler;
        this.jira = jira;
        this.jiraUsername = jiraUsername;
        this.jiraPassword = jiraPassword;
    }

    post(httpRequest:IHttpRequest, httpResponse:IHttpResponse):void {
        this.jiraRestClient.createAutheticatedSession(this.jiraUsername, this.jiraPassword)
            .then(jiraSession => jiraSession.issueKeysForJQL(httpRequest.body))
            .then(issueKeysForJQL => httpResponse.end(issueKeysForJQL.toJSON()))
            .catch(error => this.errorHandler.handleError(httpResponse, error));
    }
}
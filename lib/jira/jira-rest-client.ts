import Rest from "../rest/rest";
import JiraRestSession from "./jira-rest-session";
import IThenable from "../promise/i-thenable";
import Jira from "./jira";

export default class JiraRestClient {
    private rest:Rest;
    private jiraProtocolHostAndOptionalPort:string;
    private jiraRestSessionPath:string;
    private jira:Jira;

    constructor(rest:Rest, jiraProtocolHostAndOptionalPort:string, jiraRestSessionPath:string, jira:Jira) {
        this.rest = rest;
        this.jiraProtocolHostAndOptionalPort = jiraProtocolHostAndOptionalPort;
        this.jiraRestSessionPath = jiraRestSessionPath;
        this.jira = jira;
    }

    createAutheticatedSession(username:string, password:string):IThenable<JiraRestSession> {
        const restClientAsPromised = this.rest.newRestClientAsPromised(this.jiraProtocolHostAndOptionalPort);
        const postPayload = {
            body: {
                username: username,
                password: password
            },
            json: true
        };
        return restClientAsPromised.post(this.jiraRestSessionPath, postPayload)
            .then(_=>this.jira.newJiraRestSession(restClientAsPromised));
    }
}
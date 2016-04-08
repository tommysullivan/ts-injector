import JiraConfiguration from "./jira-configuration";
import JiraRestSession from "./jira-rest-session";
import RestClientAsPromised from "../rest/rest-client-as-promised";
import IJSONObject from "../typed-json/i-json-object";
import JiraRestClient from "./jira-rest-client";
import Rest from "../rest/rest";

export default class Jira {
    private jiraConfiguration:JiraConfiguration;
    private rest:Rest;

    constructor(jiraConfiguration:JiraConfiguration, rest:Rest) {
        this.jiraConfiguration = jiraConfiguration;
        this.rest = rest;
    }

    newJiraRestSession(authedRestClient:RestClientAsPromised):JiraRestSession {
        return new JiraRestSession(authedRestClient, this.jiraConfiguration);
    }

    newJiraRestClient():JiraRestClient {
        return new JiraRestClient(
            this.rest,
            this.jiraConfiguration.jiraProtocolHostAndOptionalPort,
            this.jiraConfiguration.jiraRestSessionPath,
            this
        );
    }
}
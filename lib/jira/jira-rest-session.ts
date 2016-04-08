import RestClientAsPromised from "../rest/rest-client-as-promised";
import JiraConfiguration from "./jira-configuration";
import IThenable from "../promise/i-thenable";
import IList from "../collections/i-list";
import RestResponse from "../rest/rest-response";
import IJiraComment from "./i-jira-comment";
import IJSONObject from "../typed-json/i-json-object";

export default class JiraRestSession {
    private authedRestClient:RestClientAsPromised;
    private jiraConfiguration:JiraConfiguration;

    constructor(authedRestClient:RestClientAsPromised, jiraConfiguration:JiraConfiguration) {
        this.authedRestClient = authedRestClient;
        this.jiraConfiguration = jiraConfiguration;
    }

    issueKeysForJQL(jqlQuery:string):IThenable<IList<string>> {
        return this.jsonForJQL(jqlQuery, ['id','key'])
            .then(responseJSONObject => {
                return responseJSONObject.listOfJSONObjectsNamed('issues')
                    .map(i=>i.stringPropertyNamed('key'));
            });
    }

    addCommentToIssue(comment:IJiraComment):IThenable<RestResponse> {
        var url = this.jiraConfiguration.commentPathTemplate.replace('{issueKey}', comment.issueKey);
        var postOptions = {
            body: {
                body: comment.text
            },
            json: true
        };
        return this.authedRestClient.post(url, postOptions);
    }

    jsonForJQL(jqlQueryText:string, fields:Array<string>):IThenable<IJSONObject> {
        var queryOptions = {
            qs: {
                jql: jqlQueryText,
                fields: fields.join(',')
            }
        };
        return this.authedRestClient.get(this.jiraConfiguration.jiraIssueSearchPath,queryOptions)
            .then(response => response.bodyAsJsonObject());
    }
}
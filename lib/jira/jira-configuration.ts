import IJSONObject from "../typed-json/i-json-object";

export default class JiraConfiguration {
    private configJSON:IJSONObject;

    constructor(configJSON:IJSONObject) {
        this.configJSON = configJSON;
    }

    get jiraProtocolHostAndOptionalPort():string {
        return this.configJSON.stringPropertyNamed('jiraProtocolHostAndOptionalPort');
    }

    get jiraRestSessionPath():string {
        return this.configJSON.stringPropertyNamed('jiraRestSessionPath');
    }

    get jiraIssueSearchPath():string {
        return this.configJSON.stringPropertyNamed('jiraIssueSearchPath');
    }

    get commentPathTemplate():string {
        return this.configJSON.stringPropertyNamed('commentPathTemplate');
    }
}
import TestResultModel from "./test-result-model";
import ICollections from "../../collections/i-collections";
import IJiraComment from "../../jira/i-jira-comment";

export default class JiraTestResultComment implements IJiraComment {
    private testResultModel:TestResultModel;
    private collections:ICollections;

    constructor(testResultModel:TestResultModel, collections:ICollections) {
        this.testResultModel = testResultModel;
        this.collections = collections;
    }

    get issueKey():string {
        return this.testResultModel.jiraKey;
    }

    get text():string {
        var summaryLines = this.testResultModel.summaries.map(s=>s.displayText);
        var lines = this.collections.newList<string>([
            'Tests '+this.testResultModel.status,
            'Detail Link: '+this.testResultModel.testResultURL,
        ]).append(summaryLines);
        return lines.join("\n");
    }

    toJSON():any {
        return {
            issueKey: this.issueKey,
            text: this.text
        }
    }
}
import IJSONObject from "../../typed-json/i-json-object";

export default class TestResultSummaryModel {
    private summaryJSON:IJSONObject;

    constructor(summaryJSON:IJSONObject) {
        this.summaryJSON = summaryJSON;
    }

    get type():string { return this.summaryJSON.stringPropertyNamed('type'); }
    get jiraKey():string { return this.summaryJSON.stringPropertyNamed('jiraKey'); }
    get total():number { return this.summaryJSON.numericPropertyNamed('total'); }
    get passed():number { return this.summaryJSON.numericPropertyNamed('passed'); }
    get failed():number { return this.summaryJSON.numericPropertyNamed('failed'); }
    get notExecuted():number { return this.summaryJSON.numericPropertyNamed('notExecuted'); }
    get pending():number { return this.summaryJSON.numericPropertyNamed('pending'); }

    get displayText():string {
        return `${this.type} - ${this.total} (` +
            `(${this.failed} failed, ${this.passed} passed, ${this.pending}` +
            `pending, ${this.notExecuted} not executed)`;
    }
}
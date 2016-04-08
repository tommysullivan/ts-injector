import IJSONObject from "../../typed-json/i-json-object";
import IList from "../../collections/i-list";
import TestResultSummaryModel from "./test-result-summary-model";
import TestPortal from "../test-portal";

export default class TestResultModel {
    private json:IJSONObject;
    private testPortal:TestPortal;

    constructor(json:IJSONObject, testPortal:TestPortal) {
        this.json = json;
        this.testPortal = testPortal;
    }

    get status():string { return this.json.stringPropertyNamed('status'); }
    get jiraKey():string { return this.json.stringPropertyNamed('jiraKey'); }
    get testResultURL():string { return this.json.stringPropertyNamed('testResultURL'); }
    get summaries():IList<TestResultSummaryModel> {
        return this.json.listOfJSONObjectsNamed('summaries').map(
            s=>this.testPortal.newTestResultSummaryModel(s)
        );
    }
}
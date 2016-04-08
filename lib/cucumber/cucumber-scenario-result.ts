import ICucumberScenarioResult from "./i-cucumber-scenario-result";
import IList from "../collections/i-list";
import ICucumberTag from "./i-cucumber-tag";
import Cucumber from "./cucumber";
import IJSONObject from "../typed-json/i-json-object";

export default class CucumberScenarioResult implements ICucumberScenarioResult {
    private scenarioJSON:IJSONObject;
    private cucumber:Cucumber;

    constructor(scenarioJSON:IJSONObject, cucumber:Cucumber) {
        this.scenarioJSON = scenarioJSON;
        this.cucumber = cucumber;
    }

    tags():IList<ICucumberTag> {
        return this.scenarioJSON.listOfJSONObjectsNamedOrDefaultToEmpty('tags').map(
            tagJSON=>this.cucumber.newCucumberTag(tagJSON)
        );
    }
}
import {ICucumberFeatureResult} from "./i-cucumber-feature-result";
import {IList} from "../collections/i-list";
import {ICucumberScenarioResult} from "./i-cucumber-scenario-result";
import {ICollections} from "../collections/i-collections";
import {Cucumber} from "./cucumber";
import {IJSONObject} from "../typed-json/i-json-object";

export class CucumberFeatureResult implements ICucumberFeatureResult {
    private rawCucumberFeatureJSON:IJSONObject;
    private collections:ICollections;
    private cucumber:Cucumber;

    constructor(rawCucumberFeatureJSON:IJSONObject, collections:ICollections, cucumber:Cucumber) {
        this.rawCucumberFeatureJSON = rawCucumberFeatureJSON;
        this.collections = collections;
        this.cucumber = cucumber;
    }

    get uniqueTagNames():IList<string> {
        return this.scenarios.flatMap(s => s.tags).map(t=>t.name).unique;
    }

    get scenarios():IList<ICucumberScenarioResult> {
        const scenariosJSONs = this.rawCucumberFeatureJSON.listOfJSONObjectsNamed('elements');
        return scenariosJSONs.map(
            scenarioJSON => this.cucumber.newCucumberScenarioResult(scenarioJSON)
        );
    }

    toJSON():any {
        return this.rawCucumberFeatureJSON.toJSON();
    }
}
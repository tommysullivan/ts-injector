import { binding as steps, given, when, then } from "cucumber-tsflow";
import {IList} from "../collections/i-list";
import {FeatureSetConfiguration} from "../cucumber/feature-set-configuration";
import {IFramework} from "../framework/common/i-framework";
import {IJSONArray} from "../typed-json/i-json-value";

declare const $:IFramework;
declare const module:any;

@steps()
export class FeatureSetSteps {
    private featureSetConfigurations:string;
    private featureFileNames:IList<string>;

    @given(/^I have defined feature sets configuration thusly:$/)
    setFeatureSetConfiguration(configJSON:string):void {
        this.featureSetConfigurations = configJSON;
    }
    
    @when(/^I query for a json array of feature files names for the "([^"]*)" feature set$/)
    queryForFeatureFilesForSet(featureSetId:string):void {
        const featureSetConfigs = $.typedJSON.newListOfJSONObjects(
            <IJSONArray> $.typedJSON.jsonParser.parse(this.featureSetConfigurations)
        ).map(j=>new FeatureSetConfiguration(j));
        this.featureFileNames = $.cucumber.newFeatureSets(featureSetConfigs)
            .setWithId(featureSetId).featureFilesInExecutionOrder;
    }

    @then(/^I get a json array that looks like this:$/)
    verifyJSONResult(expectedResultJSON:string):void {
        $.expect(this.featureFileNames.toArray()).to.deep.equal($.typedJSON.jsonParser.parse(expectedResultJSON));
    }
}
module.exports = FeatureSetSteps;
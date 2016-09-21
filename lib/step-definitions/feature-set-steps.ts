import { binding as steps, given, when, then } from "cucumber-tsflow";
import {Framework} from "../framework/framework";
import {IList} from "../collections/i-list";
import {FeatureSetConfiguration} from "../cucumber/feature-set-configuration";
import {FeatureSetRefConfiguration} from "../cucumber/feature-set-ref-configuration";
declare const $:Framework;
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
            (JSON.parse(this.featureSetConfigurations))
        ).map(j=>new FeatureSetConfiguration(j));
        this.featureFileNames = $.cucumber.newFeatureSets(featureSetConfigs)
            .setWithId(featureSetId).featureFilesInExecutionOrder;
    }

    @then(/^I get a json array that looks like this:$/)
    verifyJSONResult(expectedResultJSON:string):void {
        $.expect(this.featureFileNames.toArray()).to.deep.equal(JSON.parse(expectedResultJSON));
    }
}
module.exports = FeatureSetSteps;
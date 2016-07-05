import { binding as steps, given, when, then } from "cucumber-tsflow";
import Framework from "../../lib/framework/framework";
import IList from "../../lib/collections/i-list";
declare var $:Framework;
declare var module:any;

@steps()
export default class FeatureSetSteps {
    private featureSetConfiguration:string;
    private featureFileNames:IList<string>;

    @given(/^I have defined feature sets configuration thusly:$/)
    setFeatureSetConfiguration(configJSON:string):void {
        this.featureSetConfiguration = configJSON;
    }
    
    @when(/^I query for a json array of feature files names for the "([^"]*)" feature set$/)
    queryForFeatureFilesForSet(featureSetId:string):void {
        this.featureFileNames = $.cucumber.newFeatureSets(
            $.typedJSON.newListOfJSONObjects(<Array<any>> JSON.parse(this.featureSetConfiguration))
        ).setWithId(featureSetId).featureFilesInExecutionOrder;
    }

    @then(/^I get a json array that looks like this:$/)
    verifyJSONResult(expectedResultJSON:string):void {
        $.expect(this.featureFileNames.toArray()).to.deep.equal(JSON.parse(expectedResultJSON));
    }
}
module.exports = FeatureSetSteps;
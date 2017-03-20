import {IList} from "../collections/i-list";
import {FeatureSetConfiguration} from "../cucumber/feature-set-configuration";
import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {IJSONArray} from "../typed-json/i-json-value";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";

declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {
    let featureSetConfigurations:string;
    let featureFileNames:IList<string>;

    this.Before(function () {
        featureSetConfigurations = undefined;
        featureFileNames = undefined;
    });

    this.Given(/^I have defined feature sets configuration thusly:$/, (configJSON:string) => {
        featureSetConfigurations = configJSON;
    });
    
    this.When(/^I query for a json array of feature files names for the "([^"]*)" feature set$/, (featureSetId:string) => {
        const featureSetConfigs = $.typedJSON.newListOfJSONObjects(
            <IJSONArray> $.typedJSON.jsonParser.parse(featureSetConfigurations)
        ).map(j=>new FeatureSetConfiguration(j));
        featureFileNames = $.cucumber.newFeatureSets(featureSetConfigs)
            .setWithId(featureSetId).featureFilesInExecutionOrder;
    });

    this.Then(/^I get a json array that looks like this:$/, (expectedResultJSON:string):PromisedAssertion => {
        return $.expect(featureFileNames.toArray()).to.deep.equal($.typedJSON.jsonParser.parse(expectedResultJSON));
    });
};
import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {NodeConfiguration} from "../nodes/node-configuration";
import {INodeConfiguration} from "../nodes/i-node-configuration";
import {ServiceGroupConfig} from "../services/service-group-config";
import {IServiceGroupConfig} from "../services/i-service-group-config";
import {Node} from "../clusters/node";
import {IList} from "../collections/i-list";
import {IJSONHash} from "../typed-json/i-json-value";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";

declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {

    let nodeConfigObject:INodeConfiguration;
    let serviceGroupObject:IList<IServiceGroupConfig>;

    this.Before(function () {
        nodeConfigObject = undefined;
        serviceGroupObject = undefined;
    });

    this.Given(/^The services for a node are set based on the following JSON$/, (nodeConfigJsonString:string) => {
        const nodeConfiguration = $.typedJSON.newJSONObject(
            <IJSONHash> $.typedJSON.jsonParser.parse(nodeConfigJsonString)
        );
        nodeConfigObject = new NodeConfiguration(nodeConfiguration);
    });

    this.Then(/^I verify the service names for above node are$/, (listOfServiceNames:string):PromisedAssertion => {
        var expectedList = $.collections.newList(listOfServiceNames.split(`\n`));
        const nodeUnderTest = new Node(nodeConfigObject, null, null, null, null, null, null, null, null, null, $.collections, null, serviceGroupObject);
        var serviceNamesAsList = nodeUnderTest.expectedServiceNames;
        return $.expect(serviceNamesAsList.containAll(expectedList)).to.be.true;
    });

    this.Given(/^I have the service groups defined according to the following json$/, (serviceGroupConfigString:string) => {
        const serviceGroupConfiguration = $.typedJSON.newJSONObject(
            <IJSONHash> $.typedJSON.jsonParser.parse(serviceGroupConfigString)
        );
        serviceGroupObject = serviceGroupConfiguration.listOfJSONObjectsNamed(`serviceGroups`)
            .map(serviceConfig => new ServiceGroupConfig(serviceConfig));
    });
};
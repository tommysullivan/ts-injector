import { binding as steps, given, when, then } from "cucumber-tsflow";
import {Framework} from "../framework/framework";
import {NodeConfiguration} from "../nodes/node-configuration";
import {INodeConfiguration} from "../nodes/i-node-configuration";
import {ServiceGroupConfig} from "../services/service-group-config";
import {IServiceGroupConfig} from "../services/i-service-group-config";
import {NodeUnderTest} from "../cluster-testing/node-under-test";
import {IList} from "../collections/i-list";

declare const $:Framework;
declare const module:any;

@steps()
export class NodeServiceSteps {

    private nodeConfigObject:INodeConfiguration;
    private serviceGroupObject:IList<IServiceGroupConfig>;

    @given(/^The services for a node are set based on the following JSON$/)
    public setNodeConfigFromJson(nodeConfigJsonString:string) {
        const nodeConfiguration = $.typedJSON.newJSONObject(JSON.parse(nodeConfigJsonString));
        this.nodeConfigObject = new NodeConfiguration(nodeConfiguration);
    }

    @then(/^I verify the service names for above node are$/)
    public verifyServcieNamesReturned(listOfServiceNames:string) {
        var expectedList = $.collections.newList(listOfServiceNames.split(`\n`));
        const nodeUnderTest = new NodeUnderTest(this.nodeConfigObject, null, null, null, null, null, null, null, null, null, $.collections, null, this.serviceGroupObject);
        var serviceNamesAsList = nodeUnderTest.serviceNames;
        $.expect(serviceNamesAsList.containAll(expectedList)).to.be.true;
    };

    @given(/^I have the service groups defined according to the following json$/)
    public setServiceGroupConfigFromJson(serviceGroupConfigString:string) {
        const serviceGroupConfiguration = $.typedJSON.newJSONObject(JSON.parse(serviceGroupConfigString));
        this.serviceGroupObject = serviceGroupConfiguration.listOfJSONObjectsNamed(`serviceGroups`)
            .map(serviceConfig => new ServiceGroupConfig(serviceConfig.toJSON()));
    }
}

module.exports = NodeServiceSteps;
import {IClusterTestingConfiguration} from "../cluster-testing/i-cluster-testing-configuration";
import {ClusterTestingConfiguration} from "../cluster-testing/cluster-testing-configuration";
import {IDockerInfrastructureConfiguration} from "../docker/i-docker-infrastructure-config";
import {DockerInfrastructureConfiguration} from "../docker/docker-infrastructure-config";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {IMarathonRestClient} from "../marathon/i-marathon-rest-client";
import {IList} from "../collections/i-list";
import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {NotImplementedError} from "../errors/not-implemented-error";

declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {

    let dockerInfraConfig: IDockerInfrastructureConfiguration;
    let clusterTestingConfig: IClusterTestingConfiguration;
    let imageName:string;
    let marathonRestClient:IMarathonRestClient;
    let createdImages:IList<string>;

    this.Before(function () {
        dockerInfraConfig = undefined;
        clusterTestingConfig = undefined;
        imageName = undefined;
        marathonRestClient = undefined;
        createdImages = undefined;
    });

    this.Given(/^The docker information is set based on the following JSON$/, (dockerConfigJsonString: string) => {
        const dockerConfig = $.typedJSON.newJSONObject(JSON.parse(dockerConfigJsonString));
        this.dockerInfraConfig = new DockerInfrastructureConfiguration(dockerConfig.jsonObjectNamed(`dockerInfrastructure`));
    });

    this.Given(/^I set the image name in cluster testing config based on following JSON$/, (clusterTestJsonString:string) => {
        const testingConfig = $.typedJSON.newJSONObject(JSON.parse(clusterTestJsonString));
        clusterTestingConfig = new ClusterTestingConfiguration(testingConfig.jsonObjectNamed(`clusterTesting`), $.process, $.collections);
    });

    this.Then(/^I verify the Json being sent to marathon is the following$/, (jsonToSend) => {
        const formattedJson = JSON.parse(jsonToSend);
        throw new NotImplementedError();
    });

    this.Then(/^I launch the docker image on marathon$/, ():PromisedAssertion => {
        throw new NotImplementedError();
    });

    this.Then(/^I verify the image was created was "([^"]*)"$/, (imageName:string) => {
        const marathonIP = $.collections.newList(dockerInfraConfig.mesosClusters).first.marathonIP;
        const marathonPort = $.collections.newList(dockerInfraConfig.mesosClusters).first.marathonPort;
        marathonRestClient = $.marathon.newMarathonRestClient(marathonIP, marathonPort);
        const result = marathonRestClient.getApplicationIP(imageName).then(ip => console.log(ip));
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Then(/^I kill the created image with name "([^"]*)"$/, (imageName:string) => {
        const result = this.marathonRestClient.killApplication(this.imageName);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Then(/^I verify the image "([^"]*)" is deleted$/, (imageName:string) => {
        const marathonIP = $.collections.newList(dockerInfraConfig.mesosClusters).first.marathonIP;
        const marathonPort = $.collections.newList(dockerInfraConfig.mesosClusters).first.marathonPort;
        marathonRestClient = $.marathon.newMarathonRestClient(marathonIP, marathonPort);
        return marathonRestClient.checkApplicationRunning(createdImages.first)
            .then(message => {
                console.log(message);
                return $.expect(message).to.equal(`Application Does not exist`);
            });
    });

    this.Then(/^I verify the above group was created$/, ():PromisedAssertion  => {
        const marathonIP = $.collections.newList(dockerInfraConfig.mesosClusters).first.marathonIP;
        const marathonPort = $.collections.newList(dockerInfraConfig.mesosClusters).first.marathonPort;
        marathonRestClient = $.marathon.newMarathonRestClient(marathonIP, marathonPort);
        return marathonRestClient.getAllApplicationIdsInGroup(imageName)
            .then(listOfIds => $.expect(listOfIds.length).to.equal(1));
    });

    this.Then(/^I kill all created group$/, () => {
        const marathonIP = $.collections.newList(dockerInfraConfig.mesosClusters).first.marathonIP;
        const marathonPort = $.collections.newList(dockerInfraConfig.mesosClusters).first.marathonPort;
        marathonRestClient = $.marathon.newMarathonRestClient(marathonIP, marathonPort);
        const result = marathonRestClient.clearGroup(imageName);
        return $.expect(result).to.eventually.be.fulfilled;
    });
};

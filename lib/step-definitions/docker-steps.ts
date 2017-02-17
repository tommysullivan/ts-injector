import { binding as steps, given, when, then } from "cucumber-tsflow";
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

@steps()
export class DockerSteps {

    private dockerInfraConfig: IDockerInfrastructureConfiguration;
    private clusterTestingConfig: IClusterTestingConfiguration;
    private imageName:string;
    private marathonRestClient:IMarathonRestClient;
    private createdImages:IList<string>;

    @given(/^The docker information is set based on the following JSON$/)
    public setDockerInformation(dockerConfigJsonString: string): void {
        const dockerConfig = $.typedJSON.newJSONObject(JSON.parse(dockerConfigJsonString));
        this.dockerInfraConfig = new DockerInfrastructureConfiguration(dockerConfig.jsonObjectNamed(`dockerInfrastructure`));
    }

    @given(/^I set the image name in cluster testing config based on following JSON$/)
    public setDockerImageName(clusterTestJsonString:string): void {
        const testingConfig = $.typedJSON.newJSONObject(JSON.parse(clusterTestJsonString));
        this.clusterTestingConfig = new ClusterTestingConfiguration(testingConfig.jsonObjectNamed(`clusterTesting`), $.process, $.collections);
    }

    @then(/^I verify the Json being sent to marathon is the following$/)
    public verifyMarathonJson(jsonToSend): PromisedAssertion {
        const formattedJson = JSON.parse(jsonToSend);
        throw new NotImplementedError();
    }

    @then(/^I launch the docker image on marathon$/)
    public launchDockerImage(): PromisedAssertion {
        throw new NotImplementedError();
    }

    @then(/^I verify the image was created was "([^"]*)"$/)
    public verifyImageCreation(imageName): PromisedAssertion {
        const marathonIP = $.collections.newList(this.dockerInfraConfig.mesosClusters).first.marathonIP;
        const marathonPort = $.collections.newList(this.dockerInfraConfig.mesosClusters).first.marathonPort;
        this.marathonRestClient = $.marathon.newMarathonRestClient(marathonIP, marathonPort);
        const result = this.marathonRestClient.getApplicationIP(this.imageName).then(ip => console.log(ip));
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @then(/^I kill the created image with name "([^"]*)"$/)
    public killCreatedImage(imageName:string):PromisedAssertion {
        const result = this.marathonRestClient.killApplication(this.imageName);
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @then(/^I verify the image "([^"]*)" is deleted$/)
    public verifyImageDeleted(imageName:string): PromisedAssertion {
        const marathonIP = $.collections.newList(this.dockerInfraConfig.mesosClusters).first.marathonIP;
        const marathonPort = $.collections.newList(this.dockerInfraConfig.mesosClusters).first.marathonPort;
        this.marathonRestClient = $.marathon.newMarathonRestClient(marathonIP, marathonPort);
        return this.marathonRestClient.checkApplicationRunning(this.createdImages.first)
            .then(message => {
                console.log(message);
                return $.expect(message).to.equal(`Application Does not exist`);
            });
    }

    @then(/^I verify the above group was created$/)
    public checkGroupCreation():PromisedAssertion {
        const marathonIP = $.collections.newList(this.dockerInfraConfig.mesosClusters).first.marathonIP;
        const marathonPort = $.collections.newList(this.dockerInfraConfig.mesosClusters).first.marathonPort;
        this.marathonRestClient = $.marathon.newMarathonRestClient(marathonIP, marathonPort);
        return this.marathonRestClient.getAllApplicationIdsInGroup(this.imageName)
            .then(listOfIds => $.expect(listOfIds.length).to.equal(1));
    }

    @then(/^I kill all created group$/)
    public killCreatedGroup():PromisedAssertion {
        const marathonIP = $.collections.newList(this.dockerInfraConfig.mesosClusters).first.marathonIP;
        const marathonPort = $.collections.newList(this.dockerInfraConfig.mesosClusters).first.marathonPort;
        this.marathonRestClient = $.marathon.newMarathonRestClient(marathonIP, marathonPort);
        const result = this.marathonRestClient.clearGroup(this.imageName);
        return $.expect(result).to.eventually.be.fulfilled;
    }

}

module.exports = DockerSteps;
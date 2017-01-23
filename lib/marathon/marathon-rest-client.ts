import {IMarathonRestClient} from "./i-marathon-rest-client";
import {IJSONObject} from "../typed-json/i-json-object";
import {IMarathon} from "./i-marathon";
import {IMarathonResult} from "./i-marathon-result";
import {IList} from "../collections/i-list";
import {IFuture} from "../futures/i-future";
import {IRest} from "../rest/common/i-rest";

export class MarathonRestClient implements IMarathonRestClient {

    constructor(
        private rest:IRest,
        private marathonURL:string,
        private marathon:IMarathon
    ){}

    createApplicationAndGetID(applicationBody:IJSONObject): IFuture<string> {
        const restClientAsPromised = this.rest.newRestClient(this.marathonURL);
        return restClientAsPromised.post(`/v2/apps`, applicationBody.toJSON())
            .then(response => {
                return this.marathon.newMarathonResult(response.jsonBody).id;
            });
    }

    checkApplicationRunning(appId:string): IFuture<string> {
        const restClientAsPromised = this.rest.newRestClient(this.marathonURL);
        return restClientAsPromised.get(`/v2/apps/${appId}`)
            .then(response => {
                const appsJson = this.marathon.newMarathonResult(response.jsonBody).apps;
                return appsJson.first.stringPropertyNamed(`id`);
            })
    }

    killApplication(appId: string): IFuture<IMarathonResult> {
        const restClientAsPromised = this.rest.newRestClient(this.marathonURL);
        return restClientAsPromised.delete(`/v2/apps/${appId}`)
            .then(response => this.marathon.newMarathonResult(response.jsonBody));
    }

    getApplicationIP(appId:string): IFuture<string> {
        const restClientAsPromised = this.rest.newRestClient(this.marathonURL);
        return restClientAsPromised.get(`/v2/apps/${appId}`)
            .then(response => this.marathon.newMarathonResult(response.jsonBody).ipAddressOfLaunchedImage)
    }

    createEmptyGroup(groupName:string) : IFuture<string> {
        const restClientAsPromised = this.rest.newRestClient(this.marathonURL);
        const jsonBody = {
                id : groupName,
                apps:[]
            };
        return restClientAsPromised.post(`/v2/groups`,jsonBody).then(response => response.bodyAsJsonObject.stringPropertyNamed(`deploymentId`));
    }

    createApplicationWithGroup(groupName:string, applicationBody:IList<IJSONObject>) : IFuture<string> {
        const restClientAsPromised = this.rest.newRestClient(this.marathonURL);
        const jsonRequest = {
                apps: applicationBody.toJSON()

        };
        return restClientAsPromised.put(`/v2/groups/${groupName}`, jsonRequest)
            .then(response => applicationBody.first.stringPropertyNamed(`id`));
    }

    clearGroup(groupName:string): IFuture<string> {
        const restClientAsPromised = this.rest.newRestClient(this.marathonURL);
        return restClientAsPromised.delete(`/v2/groups/${groupName}?force=true`)
            .then(response => response.bodyAsJsonObject.stringPropertyNamed(`deploymentId`));
    }

    getAllApplicationIPsInGroup(groupName:string):IFuture<IList<string>> {
        return this.getAllApplicationIdsInGroup(groupName)
            .then(idsList =>idsList.mapToFutureList(id => this.getApplicationIP(id)))
    }

    getApplicationIPInGroup(groupName:string, appId:string): IFuture<string> {
        const restClientAsPromised = this.rest.newRestClient(this.marathonURL);
        return restClientAsPromised.get(`/v2/apps/${groupName}/${appId}`)
            .then(response => this.marathon.newMarathonResult(response.jsonBody).ipAddressOfLaunchedImage);
    }

    getAllApplicationIdsInGroup(groupName:string) :IFuture<IList<string>> {
        const restClientAsPromised = this.rest.newRestClient(this.marathonURL);
        return restClientAsPromised.get(`/v2/groups/${groupName}`)
            .then(response => {
                const appList = <IList<IJSONObject>>this.marathon.newMarathonResult(response.jsonBody).apps;
                return appList.map(app => app.stringPropertyNamed(`id`));
            })
    }

}
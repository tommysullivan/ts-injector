import {IFuture} from "../promise/i-future";
import {IMCSRestClient} from "./i-mcs-rest-client";
import {IRest} from "../rest/i-rest";
import {IMCS} from "./i-mcs";
import {IMCSRestSession} from "./i-mcs-rest-session";

export class MCSRestClient implements IMCSRestClient {

    constructor(
        private rest:IRest,
        private mcsProtocolHostAndOptionalPort:string,
        private mcsLoginPath:string,
        private mcs:IMCS
    ) {}

    createAutheticatedSession(username:string, password:string):IFuture<IMCSRestSession> {
        const restClientAsPromised = this.rest.newRestClientAsPromised(this.mcsProtocolHostAndOptionalPort);
        const postPayload = {
            form: {
                username: username,
                password: password
            }
        }
        return restClientAsPromised.post(this.mcsLoginPath, postPayload)
            .then(ignoredResponse=>this.mcs.newMCSRestSession(restClientAsPromised));
    }
}
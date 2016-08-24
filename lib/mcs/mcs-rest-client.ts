import IThenable from "../promise/i-thenable";
import MCSRestSession from "./mcs-rest-session";
import Rest from "../rest/rest";
import MCS from "./mcs";

export default class MCSRestClient {
    private rest:Rest;
    private mcsProtocolHostAndOptionalPort:string;
    private mcsLoginPath:string;
    private mcs:MCS;

    constructor(rest:Rest, mcsProtocolHostAndOptionalPort:string, mcsLoginPath:string, mcs:MCS) {
        this.rest = rest;
        this.mcsProtocolHostAndOptionalPort = mcsProtocolHostAndOptionalPort;
        this.mcsLoginPath = mcsLoginPath;
        this.mcs = mcs;
    }

    createAutheticatedSession(username:string, password:string):IThenable<MCSRestSession> {
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
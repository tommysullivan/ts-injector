import {IMarathon} from "./i-marathon";
import {IMarathonRestClient} from "./i-marathon-rest-client";
import {MarathonRestClient} from "./marathon-rest-client";
import {IMarathonResult} from "./i-marathon-result";
import {MarathonResult} from "./marathon-result";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {ISSHAPI} from "../ssh/i-ssh-api";
import {ISSHSession} from "../ssh/i-ssh-session";
import {IRest} from "../rest/common/i-rest";
import {IFuture} from "../futures/i-future";
import {ICollections} from "../collections/i-collections";

export class Marathon implements IMarathon {

    constructor(
        private rest:IRest,
        private typedJSON:ITypedJSON,
        private sshApi:ISSHAPI,
        private collections:ICollections
    ){}

    newMarathonRestClient(host: string, port: string): IMarathonRestClient {
        const url = `http://${host}:${port}`;
        return new MarathonRestClient(this.rest, url, this);
    }

    newMarathonResult(resultBody:any):IMarathonResult {
        return new MarathonResult(this.typedJSON, resultBody, this.collections)
    }


    newMarathonSSHClient(host: string, user: string, password: string):IFuture<ISSHSession> {
            return this.sshApi.newSSHClient().connect(host,user,password);
    }
}
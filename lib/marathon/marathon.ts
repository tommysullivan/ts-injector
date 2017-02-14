import {IMarathon} from "./i-marathon";
import {IMarathonRestClient} from "./i-marathon-rest-client";
import {MarathonRestClient} from "./marathon-rest-client";
import {IMarathonResult} from "./i-marathon-result";
import {MarathonResult} from "./marathon-result";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IRest} from "../rest/common/i-rest";
import {ICollections} from "../collections/i-collections";

export class Marathon implements IMarathon {

    constructor(
        private rest:IRest,
        private typedJSON:ITypedJSON,
        private collections:ICollections
    ){}

    newMarathonRestClient(host: string, port: string): IMarathonRestClient {
        const url = `http://${host}:${port}`;
        return new MarathonRestClient(this.rest, url, this);
    }

    newMarathonResult(resultBody:any):IMarathonResult {
        return new MarathonResult(this.typedJSON, resultBody, this.collections)
    }
}
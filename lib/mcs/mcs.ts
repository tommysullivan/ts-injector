import {MCSRestClient} from "./mcs-rest-client";
import {MCSRestSession} from "./mcs-rest-session";
import {MCSDashboardInfo} from "./mcs-dashboard-info";
import {IJSONObject} from "../typed-json/i-json-object";
import {MCSServiceInfo} from "./mcs-service-info";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IErrors} from "../errors/i-errors";
import {IRest} from "../rest/common/i-rest";
import {IRestClient} from "../rest/common/i-rest-client";
import {IMCS} from "./i-mcs";
import {IMCSConfiguration} from "./i-mcs-configuration";
import {IMCSRestSession} from "./i-mcs-rest-session";
import {IMCSDashboardInfo} from "./i-mcs-dashboard-info";
import {IMCSServiceInfo} from "./i-mcs-service-info";
import {IMCSRestClient} from "./i-mcs-rest-client";

export class MCS implements IMCS {

    constructor(
        private mcsConfiguration:IMCSConfiguration,
        private rest:IRest,
        private typedJSON:ITypedJSON,
        private errors:IErrors
    ) {}

    newMCSClient(host:string):IMCSRestClient {
        const url = this.mcsConfiguration.mcsUrlTemplate.replace('{host}', host);
        return new MCSRestClient(this.rest, url, this.mcsConfiguration.mcsLoginPath, this);
    }

    newMCSRestSession(authedRestClient:IRestClient):IMCSRestSession {
        return new MCSRestSession(
            authedRestClient,
            this.mcsConfiguration,
            this,
            this.typedJSON,
            this.errors
        );
    }

    newMCSDashboardInfo(dashboardInfoJSONObject:IJSONObject):IMCSDashboardInfo {
        return new MCSDashboardInfo(dashboardInfoJSONObject, this);
    }

    newMCSServiceInfo(name:string, serviceJSONObject:IJSONObject):IMCSServiceInfo {
        return new MCSServiceInfo(name, serviceJSONObject);
    }
}
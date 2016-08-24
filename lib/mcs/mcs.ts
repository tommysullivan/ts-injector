import MCSRestClient from "./mcs-rest-client";
import RestClientAsPromised from "../rest/rest-client-as-promised";
import MCSRestSession from "./mcs-rest-session";
import Rest from "../rest/rest";
import MCSConfiguration from "./mcs-configuration";
import MCSDashboardInfo from "./mcs-dashboard-info";
import IJSONObject from "../typed-json/i-json-object";
import MCSServiceInfo from "./mcs-service-info";
import ITypedJSON from "../typed-json/i-typed-json";
import IErrors from "../errors/i-errors";

export default class MCS {
    private mcsConfiguration:MCSConfiguration;
    private rest:Rest;
    private typedJSON:ITypedJSON;
    private errors:IErrors;

    constructor(mcsConfiguration:MCSConfiguration, rest:Rest, typedJSON:ITypedJSON, errors:IErrors) {
        this.mcsConfiguration = mcsConfiguration;
        this.rest = rest;
        this.typedJSON = typedJSON;
        this.errors = errors;
    }

    newMCSClient(host:string):MCSRestClient {
        const url = this.mcsConfiguration.mcsUrlTemplate.replace('{host}', host);
        return new MCSRestClient(this.rest, url, this.mcsConfiguration.mcsLoginPath, this);
    }

    newMCSRestSession(authedRestClient:RestClientAsPromised):MCSRestSession {
        return new MCSRestSession(
            authedRestClient,
            this.mcsConfiguration,
            this,
            this.typedJSON,
            this.errors
        );
    }

    newMCSDashboardInfo(dashboardInfoJSONObject:IJSONObject):MCSDashboardInfo {
        return new MCSDashboardInfo(dashboardInfoJSONObject, this);
    }

    newMCSServiceInfo(name:string, serviceJSONObject:IJSONObject):MCSServiceInfo {
        return new MCSServiceInfo(name, serviceJSONObject);
    }
}
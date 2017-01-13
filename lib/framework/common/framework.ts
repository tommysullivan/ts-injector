import {IUUIDGenerator} from "../../uuid/i-uuid-generator";
import {IInstaller} from "../../installer/i-installer";
import {MCS} from "../../mcs/mcs";
import {IMCS} from "../../mcs/i-mcs";
import {ElasticSearch} from "../../elasticsearch/elasticsearch";
import {IElasticsearch} from "../../elasticsearch/i-elasticsearch";
import {Installer} from "../../installer/installer";
import {ServiceDiscoverer} from "../../clusters/service-discoverer";
import {IServiceDiscoverer} from "../../clusters/i-service-discoverer";
import {IReleasing} from "../../releasing/i-releasing";
import {Versioning} from "../../versioning/versioning";
import {IVersioning} from "../../versioning/i-versioning";
import {OperatingSystems} from "../../operating-systems/operating-systems";
import {IOperatingSystems} from "../../operating-systems/i-operating-systems";
import {Collections} from "../../collections/collections";
import {ICollections} from "../../collections/i-collections";
import {Errors} from "../../errors/errors";
import {IErrors} from "../../errors/i-errors";
import {TypedJSON} from "../../typed-json/typed-json";
import {ITypedJSON} from "../../typed-json/i-typed-json";
import {IOpenTSDB} from "../../open-tsdb/i-open-tsdb";
import {Packaging} from "../../packaging/packaging";
import {IPackaging} from "../../packaging/i-packaging";
import {OpenTSDB} from "../../open-tsdb/open-tsdb";
import {IRest} from "../../rest/common/i-rest";
import {IFrameworkConfiguration} from "./i-framework-configuration";
import {IConfigLoader} from "./i-config-loader";
import {IFutures} from "../../futures/i-futures";
import {Releasing} from "../../releasing/releasing";

declare const require:any;

export abstract class Framework {
    private _testRunGUID:string;
    private _chai:any;

    abstract get rest():IRest;
    abstract get frameworkConfigLoader():IConfigLoader;
    abstract get futures():IFutures;

    get testRunGUID():string {
        return this._testRunGUID = this._testRunGUID || this.uuidGenerator.v4();
    }

    get uuidGenerator():IUUIDGenerator {
        return require('node-uuid');
    }

    get packaging():IPackaging {
        return new Packaging(
            this.frameworkConfig.packaging,
            this.collections
        );
    }

    get openTSDB():IOpenTSDB {
        return new OpenTSDB(
            this.rest,
            this.frameworkConfig.openTSDB,
            this.collections,
            this.typedJSON
        );
    }

    get frameworkConfig():IFrameworkConfiguration { return this.frameworkConfigLoader.loadConfig(); }
    get typedJSON():ITypedJSON { return new TypedJSON(3, this.collections, 200); }
    get errors():IErrors { return new Errors(); }

    get collections():ICollections {
        return new Collections(listOfFutures=>this.futures.newFutureList(listOfFutures));
    }

    get operatingSystems():IOperatingSystems {
        return new OperatingSystems();
    }

    get versioning():IVersioning { return new Versioning(); }

    get releasing():IReleasing {
        return new Releasing(
            this.packaging,
            this.frameworkConfig.releasing,
            this.collections
        );
    }

    get serviceDiscoverer():IServiceDiscoverer {
        return new ServiceDiscoverer(this.versioning, this.futures, this.errors);
    }

    get elasticSearch():IElasticsearch {
        return new ElasticSearch(this.rest, this.frameworkConfig.elasticsearch);
    }

    get chaiAsPromised():any {
        return require("chai-as-promised");
    }

    get chai():any {
        if(!this._chai) {
            this._chai = require('chai');
            this._chai.use(this.chaiAsPromised);
        }
        return this._chai;
    }

    get mcs():IMCS {
        return new MCS(
            this.frameworkConfig.mcs,
            this.rest,
            this.typedJSON,
            this.errors
        )
    }

    get installer():IInstaller {
        return new Installer(
            this.frameworkConfig.installerClient,
            this.rest,
            this.futures,
            this.typedJSON
        );
    }
}
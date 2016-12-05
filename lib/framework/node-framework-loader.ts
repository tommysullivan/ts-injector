import {Framework} from "./framework";
import {Collections} from "../collections/collections";
import {NodeWrapperFactory} from "../node-js-wrappers/node-wrapper-factory";
import {ConfigLoader} from "./config-loader";
import {TypedJSON} from "../typed-json/typed-json";
import {Errors} from "../errors/errors";
import {IProcess} from "../node-js-wrappers/i-process";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {ICollections} from "../collections/i-collections";
import {INodeWrapperFactory} from "../node-js-wrappers/i-node-wrapper-factory";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {SSHAPI} from "../ssh/ssh-api";
import {ISSHAPI} from "../ssh/i-ssh-api";
import {IErrors} from "../errors/i-errors";
import {IConsole} from "../node-js-wrappers/i-console";
import {Rest} from "../rest/rest";
import {IFutures} from "../futures/i-futures";
import {Futures} from "../futures/futures";
import {IPromiseFactory} from "../promise/i-promise-factory";

declare const require:any;
declare const process:any;

const promiseModule = require('promise');
const childProcessModule = require('child_process');
const fsModule = require('fs');
const uuidGenerator = require('node-uuid');
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const pathModule = require("path");
const nodemiralModule = require('nodemiral');
const requestModule = require('request');
const readLineSyncModule = require('readline-sync');
const mkdirp = require('mkdirp');

chai.use(chaiAsPromised);

export class NodeFrameworkLoader {

    loadFramework():Framework {
        return new Framework(
            this.frameworkConfig,
            this.process,
            this.fileSystem,
            uuidGenerator,
            this.collections,
            this.errors,
            this.futures,
            this.typedJSON,
            this.sshAPI,
            this.nodeWrapperFactory,
            chai,
            this.console,
            this.rest,
            uuidGenerator.v4(),
            this.promiseFactory
        )
    }

    get console():IConsole {
        return this.nodeWrapperFactory.newConsole(
            console,
            this.process.environmentVariableNamedOrDefault('logLevel', 'info')
        );
    }

    get process():IProcess { return this.nodeWrapperFactory.newProcess(process); }
    get fileSystem():IFileSystem { return this.nodeWrapperFactory.fileSystem(); }
    get frameworkConfig():any { return this.frameworkConfigLoader.loadConfig(); }
    get typedJSON():ITypedJSON { return new TypedJSON(3, this.collections, 200); }
    get errors():IErrors { return new Errors(); }

    get collections():ICollections {
        return new Collections(promises=>this.futures.newFutureList(promises));
    }

    get promiseFactory():IPromiseFactory {
        return new Futures(promiseModule, this.collections);
    }

    get futures():IFutures {
        return new Futures(promiseModule, this.collections);
    }

    get rest():Rest {
        return new Rest(
            this.futures,
            requestModule,
            this.frameworkConfig.rest,
            this.typedJSON
        );
    }

    get frameworkConfigLoader():ConfigLoader {
        return new ConfigLoader(
            this.process,
            this.fileSystem,
            this.nodeWrapperFactory.path,
            this.collections,
            this.typedJSON,
            this.typedJSON.newJSONMerger()
        );
    }

    get sshAPI():ISSHAPI {
        return new SSHAPI(
            nodemiralModule,
            this.futures,
            this.nodeWrapperFactory,
            this.collections,
            this.frameworkConfig.ssh,
            uuidGenerator,
            this.nodeWrapperFactory.path,
            this.errors
        );
    }

    get nodeWrapperFactory():INodeWrapperFactory {
        return new NodeWrapperFactory(
            this.futures,
            childProcessModule,
            this.collections,
            fsModule,
            this.typedJSON,
            this.errors,
            pathModule,
            readLineSyncModule,
            mkdirp
        );
    }
}
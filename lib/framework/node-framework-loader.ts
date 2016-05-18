//<reference path="../../typings/chai/chai.d.ts" />
///<reference path="../../typings/chai-as-promised/chai-as-promised.d.ts" />

import ExpectStatic = Chai.ExpectStatic;
import ChaiStatic = Chai.ChaiStatic;
import Framework from "./framework";
import Collections from "../collections/collections";
import PromiseFactory from "../promise/promise-factory";
import NodeWrapperFactory from "../node-js-wrappers/node-wrapper-factory";
import ConfigLoader from "./config-loader";
import TypedJSON from "../typed-json/typed-json";
import Errors from "../errors/errors";
import IProcess from "../node-js-wrappers/i-process";
import IFileSystem from "../node-js-wrappers/i-filesystem";
import ICollections from "../collections/i-collections";
import INodeWrapperFactory from "../node-js-wrappers/i-node-wrapper-factory";
import IPromiseFactory from "../promise/i-promise-factory";
import ITypedJSON from "../typed-json/i-typed-json";
import SSHAPI from "../ssh/ssh-api";
import ISSHAPI from "../ssh/i-ssh-api";
import IErrors from "../errors/i-errors";
import IConsole from "../node-js-wrappers/i-console";
import Rest from "../rest/rest";
import ExpressWrappers from "../express-wrappers/express-wrappers";
import IHTTP from "../http/i-http";
import HTTP from "../node-js-wrappers/http-wrapper";

declare var require:any;
declare var process:any;

var promiseModule = require('promise');
var childProcessModule = require('child_process');
var fsModule = require('fs');
var uuidGenerator = require('node-uuid');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var pathModule = require("path");
var nodemiralModule = require('nodemiral');
var requestModule = require('request');
var nativeExpressModule = require('express');
var readLineSyncModule = require('readline-sync');
var bodyParserModule = require('body-parser');
var nativeHttpModule = require('http');

chai.use(chaiAsPromised);

export default class NodeFrameworkLoader {

    loadFramework():Framework {
        return new Framework(
            this.frameworkConfig,
            this.process,
            this.fileSystem,
            uuidGenerator,
            this.collections,
            this.errors,
            this.promiseFactory,
            this.typedJSON,
            this.sshAPI,
            this.nodeWrapperFactory,
            chai,
            this.console,
            this.rest,
            this.expressWrappers
        )
    }

    get console():IConsole { return this.nodeWrapperFactory.newConsole(console); }
    get process():IProcess { return this.nodeWrapperFactory.newProcess(process); }
    get fileSystem():IFileSystem { return this.nodeWrapperFactory.fileSystem(); }
    get frameworkConfig():any { return this.frameworkConfigLoader.loadConfig(); }
    get collections():ICollections { return new Collections(); }
    get typedJSON():ITypedJSON { return new TypedJSON(3, this.collections); }
    get errors():IErrors { return new Errors(); }

    get promiseFactory():IPromiseFactory {
        return new PromiseFactory(promiseModule, this.collections);
    }

    get expressWrappers():ExpressWrappers {
        return new ExpressWrappers(
            nativeExpressModule,
            this.promiseFactory,
            bodyParserModule,
            this.http,
            this.typedJSON,
            this.collections
        )
    }

    get http():IHTTP {
        return new HTTP(nativeHttpModule, this.promiseFactory);
    }

    get rest():Rest {
        return new Rest(
            this.promiseFactory,
            requestModule,
            this.frameworkConfig.rest,
            this.typedJSON
        );
    }

    get frameworkConfigLoader():ConfigLoader {
        return new ConfigLoader(this.process, this.fileSystem, this.nodeWrapperFactory.path);
    }

    get sshAPI():ISSHAPI {
        return new SSHAPI(
            nodemiralModule,
            this.promiseFactory,
            this.nodeWrapperFactory,
            this.collections,
            this.frameworkConfig.ssh
        );
    }

    get nodeWrapperFactory():INodeWrapperFactory {
        return new NodeWrapperFactory(
            this.promiseFactory,
            childProcessModule,
            this.collections,
            fsModule,
            this.typedJSON,
            this.errors,
            pathModule,
            readLineSyncModule
        );
    }
}
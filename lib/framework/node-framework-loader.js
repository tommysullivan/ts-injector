///<reference path="../../typings/chai/chai.d.ts" />
///<reference path="../../typings/chai-as-promised/chai-as-promised.d.ts" />
///<reference path="../../typings/sinon/sinon.d.ts" />
"use strict";
var framework_1 = require("./framework");
var collections_1 = require("../collections/collections");
var promise_factory_1 = require("../promise/promise-factory");
var node_wrapper_factory_1 = require("../node-js-wrappers/node-wrapper-factory");
var config_loader_1 = require("./config-loader");
var typed_json_1 = require("../typed-json/typed-json");
var errors_1 = require("../errors/errors");
var ssh_api_1 = require("../ssh/ssh-api");
var rest_1 = require("../rest/rest");
var express_wrappers_1 = require("../express-wrappers/express-wrappers");
var http_wrapper_1 = require("../node-js-wrappers/http-wrapper");
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
var sinon = require('sinon');
chai.use(chaiAsPromised);
var NodeFrameworkLoader = (function () {
    function NodeFrameworkLoader() {
    }
    NodeFrameworkLoader.prototype.loadFramework = function () {
        return new framework_1.default(this.frameworkConfig, this.process, this.fileSystem, uuidGenerator, this.collections, this.errors, this.promiseFactory, this.typedJSON, this.sshAPI, this.nodeWrapperFactory, chai, this.console, this.rest, this.expressWrappers, uuidGenerator.v4(), sinon);
    };
    Object.defineProperty(NodeFrameworkLoader.prototype, "console", {
        get: function () { return this.nodeWrapperFactory.newConsole(console); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeFrameworkLoader.prototype, "process", {
        get: function () { return this.nodeWrapperFactory.newProcess(process); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeFrameworkLoader.prototype, "fileSystem", {
        get: function () { return this.nodeWrapperFactory.fileSystem(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeFrameworkLoader.prototype, "frameworkConfig", {
        get: function () { return this.frameworkConfigLoader.loadConfig(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeFrameworkLoader.prototype, "collections", {
        get: function () { return new collections_1.default(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeFrameworkLoader.prototype, "typedJSON", {
        get: function () { return new typed_json_1.default(3, this.collections); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeFrameworkLoader.prototype, "errors", {
        get: function () { return new errors_1.default(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeFrameworkLoader.prototype, "promiseFactory", {
        get: function () {
            return new promise_factory_1.default(promiseModule, this.collections);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeFrameworkLoader.prototype, "expressWrappers", {
        get: function () {
            return new express_wrappers_1.default(nativeExpressModule, this.promiseFactory, bodyParserModule, this.http, this.typedJSON, this.collections);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeFrameworkLoader.prototype, "http", {
        get: function () {
            return new http_wrapper_1.default(nativeHttpModule, this.promiseFactory);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeFrameworkLoader.prototype, "rest", {
        get: function () {
            return new rest_1.default(this.promiseFactory, requestModule, this.frameworkConfig.rest, this.typedJSON);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeFrameworkLoader.prototype, "frameworkConfigLoader", {
        get: function () {
            return new config_loader_1.default(this.process, this.fileSystem, this.nodeWrapperFactory.path, this.collections);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeFrameworkLoader.prototype, "sshAPI", {
        get: function () {
            return new ssh_api_1.default(nodemiralModule, this.promiseFactory, this.nodeWrapperFactory, this.collections, this.frameworkConfig.ssh, uuidGenerator, this.nodeWrapperFactory.path, this.errors);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeFrameworkLoader.prototype, "nodeWrapperFactory", {
        get: function () {
            return new node_wrapper_factory_1.default(this.promiseFactory, childProcessModule, this.collections, fsModule, this.typedJSON, this.errors, pathModule, readLineSyncModule);
        },
        enumerable: true,
        configurable: true
    });
    return NodeFrameworkLoader;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NodeFrameworkLoader;
//# sourceMappingURL=node-framework-loader.js.map
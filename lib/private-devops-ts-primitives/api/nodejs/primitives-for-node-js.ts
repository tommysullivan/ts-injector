import {INodeWrapperFactory} from "../../node-js-wrappers/i-node-wrapper-factory";
import {IFutures} from "../../futures/i-futures";
import {IConsole} from "../../console/i-console";
import {IProcess} from "../../node-js-wrappers/i-process";
import {IFileSystem} from "../../node-js-wrappers/i-filesystem";
import {IRest} from "../../rest/common/i-rest";
import {ISSHAPI} from "../../ssh/i-ssh-api";
import {IPrimitives} from "../common/i-primitives";
import {IPrimitivesConfiguration} from "./i-primitives-configuration";

import {NodeWrapperFactory} from "../../node-js-wrappers/node-wrapper-factory";
import {Futures} from "../../futures/futures";
import {RestForNodeJS} from "../../rest/nodejs/rest-for-node-js";
import {SSHAPI} from "../../ssh/ssh-api";
import {Primitives} from "../common/primitives";
import {Console} from "../../console/console";
import * as Promise from "promise";
import * as path from "path";
import * as readLineSync from "readline-sync";
import * as nodemiral from "nodemiral";
import * as child_process from "child_process";
import * as mkdirp from "mkdirp";
import * as fs from "fs";
import * as request from "request";
import {PrimitivesConfigurationDefault} from "../primitives-configuration-default";

export class PrimitivesForNodeJS extends Primitives implements IPrimitives {
    constructor(
        private nativeProcess:any=process,
        private configuration:IPrimitivesConfiguration=PrimitivesConfigurationDefault
    ) {
        super();
    }

    get console():IConsole {
        return new Console(
            console,
            readLineSync,
            this.configuration.logLevel
        );
    }

    get process():IProcess { return this.nodeWrapperFactory.newProcess(this.nativeProcess); }
    get fileSystem():IFileSystem { return this.nodeWrapperFactory.fileSystem(); }

    get rest():IRest {
        return new RestForNodeJS(
            this.futures,
            request,
            this.configuration.rest,
            this.typedJSON,
            this.collections
        );
    }

    get sshAPI():ISSHAPI {
        return new SSHAPI(
            nodemiral,
            this.futures,
            this.nodeWrapperFactory,
            this.collections,
            this.configuration.ssh,
            this.uuidGenerator,
            this.nodeWrapperFactory.path,
            this.errors
        );
    }

    get nodeWrapperFactory():INodeWrapperFactory {
        return new NodeWrapperFactory(
            this.futures,
            child_process,
            this.collections,
            fs,
            this.typedJSON,
            this.errors,
            path,
            mkdirp
        );
    }

    get futures():IFutures {
        return new Futures(Promise, this.collections);
    }
}
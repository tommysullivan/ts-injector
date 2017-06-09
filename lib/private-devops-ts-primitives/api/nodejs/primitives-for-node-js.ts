import {IFutures} from "../../futures/i-futures";
import {IConsole} from "../../console/i-console";
import {IRest} from "../../rest/common/i-rest";
import {ISSHAPI} from "../../ssh/i-ssh-api";
import {IPrimitives} from "../common/i-primitives";
import {IPrimitivesConfiguration} from "./i-primitives-configuration";

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
import {IProcess} from "../../process/i-process";
import {IFileSystem} from "../../filesystem/i-filesystem";
import {Process} from "../../process/process";
import {FileSystem} from "../../filesystem/file-system";

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

    get process():IProcess {
        return new Process(
            this.nativeProcess,
            this.futures,
            child_process,
            this,
            this.collections
        );
    }

    get fileSystem():IFileSystem {
        return new FileSystem(
            fs,
            this.typedJSON,
            this.collections,
            this.errors,
            this.futures,
            mkdirp,
            JSON
        )
    }

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
            this,
            this.collections,
            this.configuration.ssh,
            this.uuidGenerator,
            path,
            this.errors
        );
    }

    get futures():IFutures {
        return new Futures(Promise, this.collections);
    }
}
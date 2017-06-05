import {IConsole} from "../../console/i-console";
import {ConsoleForBrowser} from "../../console/console-for-browser";
import {IProcess} from "../../node-js-wrappers/i-process";
import {IFileSystem} from "../../node-js-wrappers/i-filesystem";
import {ISSHAPI} from "../../ssh/i-ssh-api";
import {IFutures} from "../../futures/i-futures";
import {IRest} from "../../rest/common/i-rest";
import {Futures} from "../../futures/futures";
import {RESTForBrowser} from "../../rest/browser/rest-for-browser";
import {INodeWrapperFactory} from "../../node-js-wrappers/i-node-wrapper-factory";
import {Primitives} from "../common/primitives";
import {IPrimitives} from "../common/i-primitives";
import {NotImplementedError} from "../../errors/not-implemented-error";

export class PrimitivesForBrowser extends Primitives implements IPrimitives {
    constructor(
        private nativeConsole:any,
        private nativePromise:any,
        private nativeJQuery:any
    ) {
        super();
    }

    private newNotAvailableInBrowserFrameworkContextError(implementationName:string):Error {
        return new NotImplementedError(`The requested implementation, ${implementationName}, is not available in the DIA Framework Browser context.`);
    }

    get console():IConsole {
        return new ConsoleForBrowser(this.nativeConsole);
    }

    get futures():IFutures  {
        return new Futures(this.nativePromise, this.collections);
    }

    get rest():IRest  {
        return new RESTForBrowser(
            this.nativeJQuery,
            this.futures,
            this.typedJSON,
            this.collections
        );
    }

    get nodeWrapperFactory():INodeWrapperFactory {
        throw this.newNotAvailableInBrowserFrameworkContextError('nodeWrapperFactory');
    }

    get process():IProcess {
        throw this.newNotAvailableInBrowserFrameworkContextError('process');
    }

    get fileSystem():IFileSystem  {
        throw this.newNotAvailableInBrowserFrameworkContextError('fileSystem');
    }

    get sshAPI():ISSHAPI  {
        throw this.newNotAvailableInBrowserFrameworkContextError('sshAPI');
    }

}
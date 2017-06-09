import {IConsole} from "../../console/i-console";
import {ISSHAPI} from "../../ssh/i-ssh-api";
import {IFutures} from "../../futures/i-futures";
import {IRest} from "../../rest/common/i-rest";
import {IPrimitives} from "../common/i-primitives";
import {IProcess} from "../../process/i-process";
import {IFileSystem} from "../../filesystem/i-filesystem";
import {ConsoleForBrowser} from "../../console/console-for-browser";
import {Futures} from "../../futures/futures";
import {RESTForBrowser} from "../../rest/browser/rest-for-browser";
import {Primitives} from "../common/primitives";
import {NotImplementedError} from "../../errors/not-implemented-error";
import {IInjector} from "../../dependency-injection/injector";

export class PrimitivesForBrowser extends Primitives implements IPrimitives {
    constructor(
        private nativePromise:any,
        private nativeJQuery:any,
        private injector:IInjector
    ) {
        super();
    }

    private newNotAvailableInBrowserFrameworkContextError(implementationName:string):Error {
        return new NotImplementedError(`The requested implementation, ${implementationName}, is not available in the DIA Framework Browser context.`);
    }

    get console():IConsole {
        return this.injector.createInstanceOf(ConsoleForBrowser);
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
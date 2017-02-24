import {IConsole} from "./i-console";
import {IFuture} from "../futures/i-future";
import {NotImplementedError} from "../errors/not-implemented-error";

export class ConsoleForBrowser implements IConsole {
    constructor(
        private nativeBrowserConsole:any
    ) {}

    log(...args): void {
        this.nativeBrowserConsole.log(...args);
    }

    info(...args): void {
        this.nativeBrowserConsole.log(...args);
    }

    warn(...args): void {
        this.nativeBrowserConsole.log(...args);
    }

    error(...args): void {
        this.nativeBrowserConsole.log(...args);
    }

    askQuestion(questionText: string) {
        throw new NotImplementedError();
    }

    askSensitiveQuestion(questionText: string) {
        throw new NotImplementedError();
    }

    logInTheFuture<T>(message:string, ...futuresToLog:Array<IFuture<T>>):void {
        futuresToLog.forEach(future => future
            .then(v => this.log(`[Future Resolved] - ${message}`, v ? v.toString() : undefined))
            .catch(e => this.log(`[Future Rejected] - ${message}`, e ? e.toString() : undefined))
        )
    };
}
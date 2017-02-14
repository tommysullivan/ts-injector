import {IConsole} from "./i-console";
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
}
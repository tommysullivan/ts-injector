import {IConsole} from "./i-console";
import {IHash} from "../collections/i-hash";
import {IFuture} from "../futures/i-future";
import * as moment from 'moment';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'NONE';

export class Console implements IConsole {
    constructor(
        private nativeConsole:any,
        private readLineSyncModule:any,
        private logLevel:LogLevel
    ) {}

    private readonly logLevelPriorities:IHash<number> = {
        INFO: 0,
        WARN: 1,
        ERROR: 2,
        NONE: 3
    };

    private get loggablePriorityLevel():number {
        const logLevel = this.logLevelPriorities[this.logLevel];
        if(logLevel==null) {
            const allowedLevels = Object.keys(this.logLevelPriorities);
            throw new Error(`Invalid log level "${logLevel}". Please choose from: ${allowedLevels.join(',')}`);
        }
        return logLevel;
    }

    private logHeaderFor(logLevel:string, ...args:Array<any>):void {
        const currentPriorityLevel = this.logLevelPriorities[logLevel];
        const now = moment().toString().replace(/[ :]/g, '-');
        if(currentPriorityLevel >= this.loggablePriorityLevel) {
            this.log(`${logLevel} - ${now}\n`, ...args);
        }
    }

    log(...args:Array<string>):void {
        this.nativeConsole.log(...args);
    }

    info(...args): void {
        this.logHeaderFor(`INFO @ ${moment().calendar()}`, ...args);
    }

    warn(...args): void {
        this.logHeaderFor(`WARN @ ${moment().calendar()}`, ...args);
    }

    error(...args): void {
        this.logHeaderFor(`ERROR @ ${moment().calendar()}`, ...args);
    }

    askQuestion(questionText:string):string {
        return this.readLineSyncModule.question(questionText, {});
    }

    askSensitiveQuestion(questionText:string):string {
        return this.readLineSyncModule.question(questionText, { hideEchoBack: true });
    }

    logInTheFuture<T>(message:string, ...futuresToLog:Array<IFuture<T>>):void {
        futuresToLog.forEach(future => future
            .then(v => this.log(`[Future Resolved] - ${message}`, v ? v.toString() : undefined))
            .catch(e => this.log(`[Future Rejected] - ${message}`, e ? e.toString() : undefined))
        )
    };
}
import {IConsole} from "./i-console";
import {IHash} from "../collections/i-hash";
import * as moment from 'moment';

export class Console implements IConsole {
    private logLevelPriorities:IHash<number> = {
        INFO: 0,
        WARN: 1,
        ERROR: 2,
        NONE: 3
    };

    private loggablePriorityLevel:number;

    constructor(
        private nativeConsole:any,
        private readLineSyncModule:any,
        logLevel:string
    ) {
        this.loggablePriorityLevel = this.logLevelPriorities[logLevel.toUpperCase()];
        if(this.loggablePriorityLevel==null) {
            const allowedLevels = Object.keys(this.logLevelPriorities);
            throw new Error(`Invalid log level "${logLevel}". Please choose from: ${allowedLevels.join(',')}`);
        }
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
        this.logHeaderFor('INFO', ...args);
    }

    warn(...args): void {
        this.logHeaderFor('WARN', ...args);
    }

    error(...args): void {
        this.logHeaderFor('ERROR', ...args);
    }

    askQuestion(questionText:string):string {
        return this.readLineSyncModule.question(questionText, {});
    }

    askSensitiveQuestion(questionText:string):string {
        return this.readLineSyncModule.question(questionText, { hideEchoBack: true });
    }
}
import IConsole from "./i-console";

export default class Console implements IConsole {
    private nativeConsole:any;
    private readLineSyncModule:any;

    constructor(nativeConsole:any, readLineSyncModule:any) {
        this.nativeConsole = nativeConsole;
        this.readLineSyncModule = readLineSyncModule;
    }

    log(...args:Array<string>):void {
        this.nativeConsole.log.apply(this.nativeConsole, args);
    }

    logChar(char:string):void {
        throw new Error('not impl');
    }

    askQuestion(questionText:string) {
        this.readLineSyncModule.question(questionText, {});
    }

    askSensitiveQuestion(questionText:string) {
        this.readLineSyncModule.question(questionText, { hideEchoBack: true });
    }
}
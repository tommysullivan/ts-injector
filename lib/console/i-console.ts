export interface IConsole {
    log(...args:Array<any>):void;
    info(...args:Array<any>):void;
    warn(...args:Array<any>):void;
    error(...args:Array<any>):void;
    askQuestion(questionText:string);
    askSensitiveQuestion(questionText:string);
}
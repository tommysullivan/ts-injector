import {IProcess} from "../node-js-wrappers/i-process";
import {IConsole} from "../console/i-console";

export class CliHelper {
    constructor(
        private process:IProcess,
        private console:IConsole
    ) {}
    
    logError(e:any):void {
        this.console.error(
            e.stack
                ? e.stack
                : e.toJSON
                    ? e.toJSON()
                    : e.toString()
        );
    }

    verifyFillerWord(fillerWord:string, position:number):void {
        const errorMessage = `expected clarifying word "${fillerWord}"`;
        const val = this.process.getArgvOrThrow(errorMessage, position);
        if(fillerWord!=val) throw new Error(`${errorMessage} in position ${position}`);
    }
}
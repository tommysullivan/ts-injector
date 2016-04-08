interface IConsole {
    log(...args:Array<string>):void;
    logChar(character:string):void;
    askQuestion(questionText:string);
    askSensitiveQuestion(questionText:string);
}

export default IConsole;
export default class ShellEscaper {
    private _shellEscape:any;

    constructor(shellEscape:any) {
        this._shellEscape = shellEscape;
    }

    shellEscape(shellText:string):string {
        return <string>this._shellEscape([shellText]);
    }
}
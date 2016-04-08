import IHttpResponse from "../../http/i-http-response";
import IConsole from "../../node-js-wrappers/i-console";

export default class ErrorHandler {
    private console:IConsole;

    constructor(console:IConsole) {
        this.console = console;
    }

    handleError(httpResponse:IHttpResponse, error:any):void {
        httpResponse.sendStatus(500).end(`An error occurred: ${error.toString()}`);
    }
}
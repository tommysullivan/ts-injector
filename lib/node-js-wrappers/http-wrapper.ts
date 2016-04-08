import IHTTP from "./../http/i-http";
import IPromiseFactory from "../promise/i-promise-factory";
import IHTTPServer from "./../http/i-http-server";
import IThenable from "../promise/i-thenable";

export default class HTTP implements IHTTP {
    private nativeHttpModule;
    private promiseFactory:IPromiseFactory;

    constructor(nativeHttpModule, promiseFactory:IPromiseFactory) {
        this.nativeHttpModule = nativeHttpModule;
        this.promiseFactory = promiseFactory;
    }

    createServer(httpServer:IHTTPServer, hostName:string, port:number):IThenable<string> {
        return this.promiseFactory.newPromise((resolve, reject) => {
            this.nativeHttpModule.createServer(httpServer).listen(
                port,
                hostName,
                error => {
                    if(error) reject(error);
                    else resolve(`web server available at http://${hostName}:${port}`);
                });
        });
    }
}
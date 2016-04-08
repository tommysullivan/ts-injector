import IHTTPServer from "./i-http-server";
import IThenable from "../promise/i-thenable";

interface IHTTP {
    createServer(httpServer:IHTTPServer, hostName:string, port:number):IThenable<string>;
}

export default IHTTP;
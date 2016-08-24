import IExpressApplication from "./i-express-application";
import IPromiseFactory from "../promise/i-promise-factory";
import IExpressController from "./i-express-controller";
import IThenable from "../promise/i-thenable";
import IHTTP from "../http/i-http";
import ExpressWrappers from "./express-wrappers";

export default class ExpressApplication implements IExpressApplication {

    private bodyParser:any;
    private expressModule:any;
    private nativeExpressApp:any;
    private promiseFactory:IPromiseFactory;
    private http:IHTTP;
    private expressWrappers:ExpressWrappers;

    private port:number = 80;
    private hostName:string = 'localhost';

    constructor(bodyParser:any, expressModule:any, nativeExpressApp:any, promiseFactory:IPromiseFactory, http:IHTTP, expressWrappers:ExpressWrappers) {
        this.bodyParser = bodyParser;
        this.expressModule = expressModule;
        this.nativeExpressApp = nativeExpressApp;
        this.promiseFactory = promiseFactory;
        this.http = http;
        this.expressWrappers = expressWrappers;
    }

    setPort(port:number):ExpressApplication {
        this.port = port;
        this.nativeExpressApp.set('port', port);
        return this;
    }

    setHostName(hostName:string):ExpressApplication {
        this.hostName = hostName;
        return this;
    }

    addStaticWebContentPath(pathToFolderContainingStaticWebContent:string):ExpressApplication {
        this.nativeExpressApp.use(
            this.expressModule.static(pathToFolderContainingStaticWebContent)
        );
        return this;
    }

    automaticallyParseJSONBody(sizeLimitInMegabytes:number):ExpressApplication {
        this.nativeExpressApp.use(this.bodyParser.text(
            {
                limit: `${sizeLimitInMegabytes}mb`,
                type: `*/*`
            }
        ));

        return this;
    }

    private addHandler(httpMethod:string, path:string, controller:IExpressController):ExpressApplication {
        this.nativeExpressApp[httpMethod](path, (nativeExpressRequest, nativeExpressResponse) => {
            controller[httpMethod](
                this.expressWrappers.newExpressHttpRequest(nativeExpressRequest),
                this.expressWrappers.newExpressHttpResponse(nativeExpressResponse)
            );
        });
        return this;
    }

    get(path:string, controller:IExpressController):ExpressApplication {
        return this.addHandler('get', path, controller);
    }

    put(path:string, controller:IExpressController):ExpressApplication {
        return this.addHandler('put', path, controller);
    }

    post(path:string, controller:IExpressController):ExpressApplication {
        return this.addHandler('post', path, controller);
    }

    delete(path:string, controller:IExpressController):ExpressApplication {
        return this.addHandler('delete', path, controller);
    }

    start():IThenable<string> {
        return this.http.createServer(this.nativeExpressApp, this.hostName, this.port);
    }
}
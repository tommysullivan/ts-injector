import IThenable from "../promise/i-thenable";
import ExpressApplication from "./express-application";
import IExpressController from "./i-express-controller";

interface IExpressApplication {
    setPort(port:number):ExpressApplication;
    setHostName(hostName:string):ExpressApplication;
    addStaticWebContentPath(pathToFolderContainingStaticWebContent:string):ExpressApplication;
    automaticallyParseJSONBody(sizeLimitInMegabytes:number):ExpressApplication;
    start():IThenable<string>;
    get(path:string, controller:IExpressController):ExpressApplication;
    put(path:string, controller:IExpressController):ExpressApplication;
    post(path:string, controller:IExpressController):ExpressApplication;
    delete(path:string, controller:IExpressController):ExpressApplication;
}

export default IExpressApplication;
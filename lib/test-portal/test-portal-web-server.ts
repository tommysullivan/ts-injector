import IThenable from "../promise/i-thenable";
import ExpressWrappers from "../express-wrappers/express-wrappers";
import IExpressController from "../express-wrappers/i-express-controller";
import TestPortalConfiguration from "./test-portal-configuration";
import IPath from "../node-js-wrappers/i-path";

declare var __dirname:string;

export default class TestPortalWebServer {
    private expressWrappers:ExpressWrappers;
    private testResultsController:IExpressController;
    private testResultController:IExpressController;
    private testConfigController:IExpressController;
    private testCliInvocationsController:IExpressController;
    private jqlQueryController:IExpressController;
    private jiraSyncRequestController:IExpressController;
    private testPortalConfiguration:TestPortalConfiguration;
    private path:IPath;
    private clustersController:IExpressController;
    private clustersRevertRequestsController:IExpressController;

    constructor(expressWrappers:ExpressWrappers, testResultsController:IExpressController, testResultController:IExpressController, testConfigController:IExpressController, testCliInvocationsController:IExpressController, jqlQueryController:IExpressController, jiraSyncRequestController:IExpressController, testPortalConfiguration:TestPortalConfiguration, path:IPath, clustersController:IExpressController, clustersRevertRequestsController:IExpressController) {
        this.expressWrappers = expressWrappers;
        this.testResultsController = testResultsController;
        this.testResultController = testResultController;
        this.testConfigController = testConfigController;
        this.testCliInvocationsController = testCliInvocationsController;
        this.jqlQueryController = jqlQueryController;
        this.jiraSyncRequestController = jiraSyncRequestController;
        this.testPortalConfiguration = testPortalConfiguration;
        this.path = path;
        this.clustersController = clustersController;
        this.clustersRevertRequestsController = clustersRevertRequestsController;
    }

    startServer():IThenable<string> {
        return this.expressWrappers.newExpressApplication()
            .setPort(this.testPortalConfiguration.httpPort)
            .setHostName(this.testPortalConfiguration.hostName)
            .addStaticWebContentPath(this.path.join(__dirname, 'static-web-content'))
            .automaticallyParseJSONBody(this.testPortalConfiguration.requestSizeLimitInMegabytes)
            .get(this.testPortalConfiguration.testCliInvocationsWebRoute, this.testCliInvocationsController)
            .post(this.testPortalConfiguration.jiraSyncRequestWebRoute, this.jiraSyncRequestController)
            .post(this.testPortalConfiguration.jqlQueryWebRoute, this.jqlQueryController)
            .get(this.testPortalConfiguration.testConfigWebRouteRoute, this.testConfigController)
            .get(this.testPortalConfiguration.testResultWebRoute, this.testResultController)
            .put(this.testPortalConfiguration.testResultWebRoute, this.testResultController)
            .get(this.testPortalConfiguration.testResultsWebRoute, this.testResultsController)
            .get(this.testPortalConfiguration.clustersWebRoute, this.clustersController)
            .post('/cluster-revert-requests', this.clustersRevertRequestsController)
            .start();
    }
}
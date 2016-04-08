import TestPortalWebServer from "./test-portal-web-server";
import TestResultsController from "./controllers/test-results-controller";
import TestResultController from "./controllers/test-result-controller";
import TestConfigController from "./controllers/test-config-controller";
import CliInvocationsController from "./controllers/cli-invocations-controller";
import JIRASyncRequestController from "./controllers/jira-sync-request-controller";
import TestPortalConfiguration from "./test-portal-configuration";
import ExpressWrappers from "../express-wrappers/express-wrappers";
import INodeWrapperFactory from "../node-js-wrappers/i-node-wrapper-factory";
import FilePathHelper from "./models/file-path-helper";
import TestResultDescriptor from "./models/test-result-descriptor";
import IFileStats from "../node-js-wrappers/i-file-stats";
import TestResultSummaryModel from "./models/test-result-summary-model";
import IJSONObject from "../typed-json/i-json-object";
import ErrorHandler from "./controllers/error-handler";
import Jira from "../jira/jira";
import JQLQueryController from "./controllers/jql-query-controller";
import IProcess from "../node-js-wrappers/i-process";
import IPromiseFactory from "../promise/i-promise-factory";
import JiraTestResultComment from "./models/jira-test-result-comment";
import ICollections from "../collections/i-collections";
import TestResultModel from "./models/test-result-model";
import IConsole from "../node-js-wrappers/i-console";

export default class TestPortal {
    private testPortalConfiguration:TestPortalConfiguration;
    private expressWrappers:ExpressWrappers;
    private nodeWrapperFactory:INodeWrapperFactory;
    private jira:Jira;
    private process:IProcess;
    private promiseFactory:IPromiseFactory;
    private collections:ICollections;
    private console:IConsole;

    constructor(testPortalConfiguration:TestPortalConfiguration, expressWrappers:ExpressWrappers, nodeWrapperFactory:INodeWrapperFactory, jira:Jira, process:IProcess, promiseFactory:IPromiseFactory, collections:ICollections, console:IConsole) {
        this.testPortalConfiguration = testPortalConfiguration;
        this.expressWrappers = expressWrappers;
        this.nodeWrapperFactory = nodeWrapperFactory;
        this.jira = jira;
        this.process = process;
        this.promiseFactory = promiseFactory;
        this.collections = collections;
        this.console = console;
    }

    newTestResultModel(json:IJSONObject):TestResultModel {
        return new TestResultModel(json, this);
    }

    newFilePathHelper():FilePathHelper {
        return new FilePathHelper(this.testPortalConfiguration, this.nodeWrapperFactory.path);
    }

    newErrorHandler():ErrorHandler {
        return new ErrorHandler(this.console);
    }

    newTestPortalWebServer(jiraUsername:string, jiraPassword:string):TestPortalWebServer {
        var fileSystem = this.nodeWrapperFactory.fileSystem();

        return new TestPortalWebServer(
            this.expressWrappers,
            new TestResultsController(
                fileSystem,
                this.testPortalConfiguration.maxResultsForExplorer,
                this.nodeWrapperFactory.path,
                this.testPortalConfiguration.fullyQualifiedResultsPath,
                this
            ),
            new TestResultController(fileSystem, this.newFilePathHelper(), this.newErrorHandler()),
            new TestConfigController(fileSystem, this.newFilePathHelper()),
            new CliInvocationsController(
                fileSystem,
                new FilePathHelper(this.testPortalConfiguration, this.nodeWrapperFactory.path)
            ),
            new JQLQueryController(
                this.jira.newJiraRestClient(),
                this.newErrorHandler(),
                this.jira,
                jiraUsername,
                jiraPassword
            ),
            new JIRASyncRequestController(
                this.jira.newJiraRestClient(),
                this.promiseFactory,
                jiraUsername,
                jiraPassword,
                this.newErrorHandler(),
                this
            ),
            this.testPortalConfiguration,
            this.nodeWrapperFactory.path
        );
    }

    newJiraTestResultComment(testResultModel:TestResultModel):JiraTestResultComment {
        return new JiraTestResultComment(testResultModel, this.collections);
    }

    newTestResultDescriptor(urlFriendlyName:string, fullPath:string, fileStats:IFileStats):TestResultDescriptor {
        return new TestResultDescriptor(urlFriendlyName, fullPath, fileStats);
    }

    newTestResultSummaryModel(summaryJSON:IJSONObject):TestResultSummaryModel {
        return new TestResultSummaryModel(summaryJSON);
    }
}
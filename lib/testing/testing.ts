import {ITestRunnerEnvironment} from "./i-test-runner-environment";
import {TestRunnerEnvironment} from "./test-runner-environment";
import {IProcess} from "../node-js-wrappers/i-process";
import {IFrameworkConfiguration} from "../framework/common/i-framework-configuration";
import {ITesting} from "./i-testing";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {ITestingConfiguration} from "./i-testing-configuration";
import {IConsole} from "../console/i-console";
import {ITestResult} from "./i-test-result";
import {TestResult} from "./test-result";
import {IJSONSerializer} from "../typed-json/i-json-serializer";
import {ICucumberTestResult} from "../cucumber/i-cucumber-test-result";
import {FilesystemResultReporter} from "./filesystem-result-reporter";
import {IResultReporter} from "./i-result-reporter";
import {PortalResultReporter} from "./portal-result-reporter";
import {MultiplexDelegateResultReporter} from "./multiplex-delegate-result-reporter";
import {IPath} from "../node-js-wrappers/i-path";
import {IRest} from "../rest/common/i-rest";
import {IRelease} from "../releasing/i-release";
import {IPhase} from "../releasing/i-phase";
import {IReleasing} from "../releasing/i-releasing";
import {IFutures} from "../futures/i-futures";
import {IURLCalculator} from "./i-url-calculator";
import {URLCalculator} from "./url-calculator";
import {ITypedJSON} from "../typed-json/i-typed-json";

export class Testing implements ITesting {
    constructor(
        private process:IProcess,
        private frameworkConfiguration:IFrameworkConfiguration,
        private fileSystem:IFileSystem,
        private testingConfiguration:ITestingConfiguration,
        private console:IConsole,
        private jsonSerializer:IJSONSerializer,
        private futures:IFutures,
        private path:IPath,
        private rest:IRest,
        private releasing:IReleasing,
        private typedJSON:ITypedJSON
    ) {}

    get defaultReleasePhase():IPhase {
        return this.defaultRelease
            .phaseNamed(this.defaultPhaseName);
    }

    get defaultPhaseName():string {
        return this.testingConfiguration.lifecyclePhase;
    }

    get defaultRelease():IRelease {
        return this.releasing.defaultReleases.releaseNamed(this.testingConfiguration.releaseUnderTest);
    }

    newTestRunnerEnvironment(testRunGUID:string):ITestRunnerEnvironment {
        return new TestRunnerEnvironment(
            testRunGUID,
            this.process,
            this.frameworkConfiguration,
            this.fileSystem,
            this.testingConfiguration,
            this.console
        );
    }

    newTestResult(testRunGUID:string, cucumberTestResult:ICucumberTestResult):ITestResult {
        return new TestResult(
            cucumberTestResult,
            this.newTestRunnerEnvironment(testRunGUID),
            this.frameworkConfiguration,
            this.jsonSerializer
        );
    }

    newResultReporter():IResultReporter {
        return new MultiplexDelegateResultReporter(
            this.newFilesystemResultReporter(),
            this.newPortalResultReporter()
        );
    }

    newFilesystemResultReporter():IResultReporter {
        return new FilesystemResultReporter(
            this.fileSystem,
            this.testingConfiguration,
            this.path,
            this.console
        );
    }

    newPortalResultReporter():IResultReporter {
        return new PortalResultReporter(
            this.rest,
            this.console,
            this.process,
            this.newUrlCalculator(),
            this.futures,
            this.typedJSON.jsonParser
        );
    }

    newUrlCalculator():IURLCalculator {
        return new URLCalculator(
            this.testingConfiguration,
            this.fileSystem
        );
    }
}
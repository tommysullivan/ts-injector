import {IProcess} from "../node-js-wrappers/i-process";
import {IConsole} from "../node-js-wrappers/i-console";
import {IList} from "../collections/i-list";
import {ICucumber} from "../cucumber/i-cucumber";
import {IUUIDGenerator} from "../uuid/i-uuid-generator";
import {CliHelper} from "./cli-helper";
import {IFuture} from "../promise/i-future";
import {ITesting} from "../testing/i-testing";
import {IJSONSerializer} from "../typed-json/i-json-serializer";
import {IResultReporter} from "../testing/i-result-reporter";
import {IURLCalculator} from "../testing/i-url-calculator";

export class CucumberCliHelper {
    constructor(
        private console:IConsole,
        private cucumber:ICucumber,
        private process:IProcess,
        private temporaryTestRunOutputFilePath:()=>string,
        private uuidGenerator:IUUIDGenerator,
        private cliHelper:CliHelper,
        private testing:ITesting,
        private resultReporter:IResultReporter,
        private jsonSerializer:IJSONSerializer,
        private urlCalculator:IURLCalculator
    ) {}

    private outputJSON<T>(list:IList<T>):void {
        this.console.log(list.toString());
    }

    runNonClusterCucumberTest(cucumberPassThruCommands: IList<string>):IFuture<any> {
        const cli = this.cucumber.newCucumberCli();
        const testRunGUID = this.uuidGenerator.v4();
        return cli.configureAndRunCucumber(testRunGUID, cucumberPassThruCommands, this.process.environmentVariables)
            .then(cucumberTestResult => {
                this.urlCalculator.writeUrlsToPropertiesFile(this.urlCalculator.calculateURL(testRunGUID));
                const result = this.testing.newTestResult(testRunGUID, cucumberTestResult);
                return this.resultReporter.reportResult(testRunGUID, this.jsonSerializer.serializeToString(result))
                    .then(_ => {
                        if(cucumberTestResult.passed) {
                            this.console.log('Success!');
                            this.process.exit(0);
                        } else {
                            this.cliHelper.logError('Test Failed!');
                            this.process.exit(1);
                        }
                    });
            })
            .catch(e => {
                this.cliHelper.logError(e);
                this.process.exit(1);
            });
    }

    showFeatureSets(detail:boolean):void {
        const allFeatureSets = this.cucumber.featureSets.all;
        this.outputJSON<any>(
            detail ? allFeatureSets : allFeatureSets.map(t=>t.id)
        );
    }

    executeTagsCli():void {
        const cucumberConfig = this.cucumber.newCucumberRunConfiguration(
            true,
            this.temporaryTestRunOutputFilePath(),
            '',
            this.process.environmentVariables.clone()
        );
        this.cucumber.newCucumberRunner(this.process, this.console)
            .runCucumber(cucumberConfig)
            .then(t=>{
                this.console.log(t.uniqueTagNames.toJSON());
            })
            .catch(error=>{
                this.console.log(`There was an error fetching tags: ${error.stack ? error.stack : error.toString()}`);
            });
    }
}



import IProcess from "../node-js-wrappers/i-process";
import IConsole from "../node-js-wrappers/i-console";
import Cucumber from "../cucumber/cucumber";
import IList from "../collections/i-list";

export default class CucumberCliHelper {
    private console:IConsole;
    private cucumber:Cucumber;
    private process:IProcess;
    private temporaryTestRunOutputFilePath:string;

    constructor(console:IConsole, cucumber:Cucumber, process:IProcess, temporaryTestRunOutputFilePath:string) {
        this.console = console;
        this.cucumber = cucumber;
        this.process = process;
        this.temporaryTestRunOutputFilePath = temporaryTestRunOutputFilePath;
    }

    private outputJSON<T>(list:IList<T>):void {
        this.console.log(list.toJSONString());
    }

    showFeatureSets():void {
        var args = this.process.commandLineArguments();
        if(args.itemAt(3)=='in' && args.itemAt(4)=='detail') this.outputJSON(this.cucumber.allFeatureSets);
        else this.outputJSON(this.cucumber.allFeatureSets.map(t=>t.id));
    }

    executeTagsCli():void {
        var cucumberConfig = this.cucumber.newCucumberRunConfiguration(
            true,
            this.temporaryTestRunOutputFilePath,
            '',
            this.process.environmentVariables().clone()
        );
        this.cucumber.newCucumberRunner(this.process, this.console).runCucumber(cucumberConfig)
            .then(t=>{
                this.console.log(t.uniqueTagNames().toJSONString());
            })
            .catch(error=>{
                this.console.log(`There was an error fetching tags: ${error.stack ? error.stack : error.toString()}`);
            });
    }
}
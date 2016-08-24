import IProcess from "../node-js-wrappers/i-process";
import CucumberCliHelper from "./cucumber-cli-helper";
import ClusterCliHelper from "./cluster-cli-helper";
import IConsole from "../node-js-wrappers/i-console";
import ClusterTesterCliHelper from "./cluster-tester-cli-helper";
import CliHelper from "./cli-helper";

export default class CliExecutor {

    constructor(
        private process:IProcess,
        private console:IConsole,
        private cucumberCliHelper:CucumberCliHelper,
        private clusterCliHelper:ClusterCliHelper,
        private clusterTesterCliHelper:ClusterTesterCliHelper,
        private cliHelper:CliHelper
    ) {}

    execute():void {
        try {
            const command = this.process.getArgvOrThrow('command', 2);
            if(command=='tags') this.cucumberCliHelper.executeTagsCli();
            else if(command=='featureSets') this.cucumberCliHelper.showFeatureSets();
            else if(command=='cluster') this.clusterCliHelper.executeClusterCli();
            else if(command=='run') this.clusterTesterCliHelper.executeTestRunCli();
            else throw new Error(`Invalid command ${command}`);
        }
        catch(e) {
            this.logUsage();
            this.cliHelper.logError(e.message);
            if(this.process.environmentVariables().get('debug')=='true') throw e;
        }
    }

    private logUsage():void {
        this.console.log([
            '',
            'Usage:',
            `${this.process.processName()} [command] [command specific arguments]`,
            '',
            'commands                  description',
            '--------                  -----------',
            'run                       execute some tests',
            'tags                      list available cucumber tags',
            'featureSets [in detail]   list runnable featureSets, optionally "in detail"',
            'cluster                   manage the cluster under test',
            ''
        ].join('\n'));
    }
}
import IProcess from "../node-js-wrappers/i-process";
import CucumberCliHelper from "./cucumber-cli-helper";
import ClusterCliHelper from "./cluster-cli-helper";
import IConsole from "../node-js-wrappers/i-console";
import ClusterTesterCliHelper from "./cluster-tester-cli-helper";
import TestPortal from "../test-portal/test-portal";
import CliHelper from "./cli-helper";

export default class CliExecutor {

    private process:IProcess;
    private console:IConsole;
    private cucumberCliHelper:CucumberCliHelper;
    private clusterCliHelper:ClusterCliHelper;
    private clusterTesterCliHelper:ClusterTesterCliHelper;
    private testPortal:TestPortal;
    private cliHelper:CliHelper;

    constructor(process:IProcess, console:IConsole, cucumberCliHelper:CucumberCliHelper, clusterCliHelper:ClusterCliHelper, clusterTesterCliHelper:ClusterTesterCliHelper, testPortal:TestPortal, cliHelper:CliHelper) {
        this.process = process;
        this.console = console;
        this.cucumberCliHelper = cucumberCliHelper;
        this.clusterCliHelper = clusterCliHelper;
        this.clusterTesterCliHelper = clusterTesterCliHelper;
        this.testPortal = testPortal;
        this.cliHelper = cliHelper;
    }

    execute():void {
        try {
            var command = this.process.getArgvOrThrow('command', 2);
            if(command=='tags') this.cucumberCliHelper.executeTagsCli();
            else if(command=='featureSets') this.cucumberCliHelper.showFeatureSets();
            else if(command=='cluster') this.clusterCliHelper.executeClusterCli();
            else if(command=='run') this.clusterTesterCliHelper.executeTestRunCli();
            else if(command=='server') {
                var args = this.process.commandLineArguments();
                var env = this.process.environmentVariables();
                var promptForJiraCreds = args.itemAt(3)=='with' && args.itemAt(4)=='jira';
                var jiraUsername = env.hasKey('jiraUsername')
                    ? env.get('jiraUsername')
                    : promptForJiraCreds
                        ? this.console.askQuestion('JIRA username: ')
                        : 'non-existent-user';
                var jiraPassword = env.hasKey('jiraPassword')
                    ? env.get('jiraPassword')
                    : promptForJiraCreds
                        ? this.console.askSensitiveQuestion('JIRA Password: ')
                        : 'non-existent-password';
                this.testPortal.newTestPortalWebServer(jiraUsername, jiraPassword).startServer()
                    .then(message=>this.console.log(message))
                    .catch(e=>this.cliHelper.logError(e));
            }
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
            'server [with jira]        run the server (if words "with jira" are present, you will be prompted for creds)',
            ''
        ].join('\n'));
    }
}
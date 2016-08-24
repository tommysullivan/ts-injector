import IProcess from "./i-process";
import IList from "../collections/i-list";
import IThenable from "../promise/i-thenable";
import IDictionary from "./../collections/i-dictionary";
import IProcessResult from "./i-process-result";
import IPromiseFactory from "../promise/i-promise-factory";
import INodeWrapperFactory from "./i-node-wrapper-factory";
import ICollections from "../collections/i-collections";

export default class Process implements IProcess {
    private nativeProcess:any;
    private promiseFactory:IPromiseFactory;
    private childProcess:any;
    private nodeWrapperFactory:INodeWrapperFactory;
    private collections:ICollections;

    constructor(nativeProcess:any, promiseFactory:IPromiseFactory, childProcess:any, nodeWrapperFactory:INodeWrapperFactory, collections:ICollections) {
        this.nativeProcess = nativeProcess;
        this.promiseFactory = promiseFactory;
        this.childProcess = childProcess;
        this.nodeWrapperFactory = nodeWrapperFactory;
        this.collections = collections;
    }

    environmentVariables():IDictionary<string> {
        return this.collections.newDictionary<string>(this.nativeProcess.env);
    }

    environmentVariableNamed(name:string):string {
        try {
            return this.environmentVariables().getOrThrow(name);
        }
        catch(e) {
            throw new Error(`environment variable "${name}" was not defined`);
        }
    }

    environmentVariableNamedOrDefault(name:string, defaultValueIfNotDefined:string):string {
        return this.environmentVariableNamedOrLazyDefault(name, () => defaultValueIfNotDefined);
    }

    environmentVariableNamedOrLazyDefault(name:string, defaultValueFuncIfNotDefined:()=>string):string {
        return this.environmentVariables().hasKey(name)
            ? this.environmentVariableNamed(name)
            : defaultValueFuncIfNotDefined();
    }

    commandLineArguments():IList<string> {
        return this.collections.newList<string>(this.nativeProcess.argv);
    }

    exit(exitCode:Number):void {
        this.nativeProcess.exit(exitCode);
    }

    throwForMissingArg(argName:string, expectedPosition:number):any {
        throw new Error(`Expected command line argument "${argName}" in position ${expectedPosition} but it was not found`);
    }

    getArgvOrThrow(argName:string, index:number):string {
        return this.commandLineArguments().itemAt(index) || this.throwForMissingArg(argName, index);
    }

    currentUserName():string {
        return this.environmentVariables().get('USER');
    }

    pathToNodeJSExecutable():string {
        return this.nativeProcess.execPath;
    }

    executeNodeProcess(command:string, environmentVariables:IDictionary<string>):IThenable<IProcessResult> {
        const env = environmentVariables.clone();
        const nodeExecutable = this.pathToNodeJSExecutable();
        env.add('PATH', `${env.get('PATH')}:${this.pathToNodeJSExecutable()}`);

        return this.promiseFactory.newPromise((resolve, reject) => {
            const stdoutParts = this.collections.newEmptyList<string>();
            const stderrParts = this.collections.newEmptyList<string>();
            const cukeProcess = this.childProcess.exec(
                `${this.pathToNodeJSExecutable()} ${command}`,
                {
                    env: env.toJSON(),
                    maxBuffer: 10 * 1024 * 1024
                }
            );

            cukeProcess.stdout.on('data', (data) => { stdoutParts.push(data) });
            cukeProcess.stderr.on('data', (data) => { stderrParts.push(data) });

            var closed = false;
            var exited = false;

            const attemptToResolvePromise = (processExitCode) => {
                if(closed && exited) {
                    const stdoutLines = this.collections.newList(stdoutParts.join('').split("\n"));
                    const stderrLines = this.collections.newList(stderrParts.join('').split("\n"));
                    const processResult = this.nodeWrapperFactory.newProcessResult(command, processExitCode, stdoutLines, stderrLines, null);
                    if(processResult.hasError()) reject(processResult);
                    else resolve(processResult);
                }
            }

            cukeProcess.on('close', processExitCode => {
                closed = true;
                attemptToResolvePromise(processExitCode);
            });

            cukeProcess.on('exit', (processExitCode, signal) => {
                exited = true;
                console.log("SignalKill : " + signal);
                attemptToResolvePromise(processExitCode);
            });

        });
    }

    processName():string {
        return this.getArgvOrThrow('processName', 1);
    }
}
import {IProcess} from "./i-process";
import {IList} from "../collections/i-list";
import {IProcessResult} from "./i-process-result";
import {INodeWrapperFactory} from "./i-node-wrapper-factory";
import {ICollections} from "../collections/i-collections";
import {IFutures} from "../futures/i-futures";
import {IDictionary} from "../collections/i-dictionary";
import {IFuture} from "../futures/i-future";

export class Process implements IProcess {
    constructor(
        private nativeProcess:any,
        private futures:IFutures,
        private nativeChildProcessModule:any,
        private nodeWrapperFactory:INodeWrapperFactory,
        private collections:ICollections
    ) {}

    get environmentVariables():IDictionary<string> {
        return this.collections.newDictionary<string>(this.nativeProcess.env);
    }

    environmentVariableNamed(name:string):string {
        try {
            return this.environmentVariables.getOrThrow(name);
        }
        catch(e) {
            throw new Error(`environment variable "${name}" was not defined`);
        }
    }

    environmentVariableNamedOrDefault(name:string, defaultValueIfNotDefined:string):string {
        return this.environmentVariableNamedOrLazyDefault(name, () => defaultValueIfNotDefined);
    }

    environmentVariableNamedOrLazyDefault(name:string, defaultValueFuncIfNotDefined:()=>string):string {
        return this.environmentVariables.hasKey(name)
            ? this.environmentVariableNamed(name)
            : defaultValueFuncIfNotDefined();
    }

    get commandLineArguments():IList<string> {
        return this.collections.newList<string>(this.nativeProcess.argv);
    }

    exit(exitCode:Number):void {
        this.nativeProcess.exit(exitCode);
    }

    throwForMissingArg(argName:string, expectedPosition:number):any {
        throw new Error(`Expected command line argument "${argName}" in position ${expectedPosition} but it was not found`);
    }

    getArgvOrThrow(argName:string, index:number):string {
        return this.commandLineArguments.itemAt(index) || this.throwForMissingArg(argName, index);
    }

    get currentUserName():string {
        return this.environmentVariables.get('USER');
    }

    get pathToNodeJSExecutable():string {
        return this.nativeProcess.execPath;
    }

    executeNodeProcess(command:string, environmentVariables:IDictionary<string>):IFuture<IProcessResult> {
        const env = environmentVariables.clone();
        const nodeExecutable = this.pathToNodeJSExecutable;
        env.add('PATH', `${env.get('PATH')}:${nodeExecutable}`);

        return this.futures.newFuture((resolve, reject) => {
            var stdOutIndices:Array<number> = [];
            var stdErrIndices:Array<number> = [];
            var allOutput:Array<string> = [];

            const cukeProcess = this.nativeChildProcessModule.exec(
                `${nodeExecutable} ${command}`,
                {
                    env: env.toJSON(),
                    maxBuffer: 10 * 1024 * 1024
                }
            );

            const addTo = (index:Array<number>) => (data:string) => index.push(allOutput.push(data) - 1);
            cukeProcess.stdout.on('data', addTo(stdOutIndices));
            cukeProcess.stderr.on('data', addTo(stdErrIndices));

            var closed = false;
            var exited = false;

            const attemptToResolvePromise = (processExitCode) => {
                if(closed && exited) {
                    const processResult = this.nodeWrapperFactory.newProcessResult(
                        command,
                        processExitCode,
                        stdOutIndices,
                        stdErrIndices,
                        allOutput,
                        null
                    );
                    if(processResult.hasError) reject(processResult);
                    else resolve(processResult);
                }
            };

            cukeProcess.on('close', processExitCode => {
                closed = true;
                attemptToResolvePromise(processExitCode);
            });

            cukeProcess.on('exit', (processExitCode, signal) => {
                exited = true;
                attemptToResolvePromise(processExitCode);
            });

        });
    }

    get processName():string {
        return this.getArgvOrThrow('processName', 1);
    }
}
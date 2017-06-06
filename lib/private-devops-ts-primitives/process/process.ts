import {IChildProcess, IProcess} from "./i-process";
import {IList} from "../collections/i-list";
import {ICollections} from "../collections/i-collections";
import {IFutures} from "../futures/i-futures";
import {IDictionary} from "../collections/i-dictionary";
import {IPrimitives} from "../api/common/i-primitives";
import {ProcessResult} from "./process-result";
import {BaseProcessResult} from "./base-process-result";

export class Process implements IProcess {
    constructor(
        private nativeProcess:any,
        private futures:IFutures,
        private nativeChildProcessModule:any,
        private primitives:IPrimitives,
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

    private execute(completeCommand: string, envVariables: IDictionary<string>):IChildProcess {
        const process = this.nativeChildProcessModule.exec(
            `${completeCommand}`,
            {
                env: envVariables.toJSON(),
                maxBuffer: 10 * 1024 * 1024
            }
        );
        const futureWithProgress = this.futures.newFutureWithProgress((resolve, reject, progress) => {
            const stdOutIndices: Array<number> = [];
            const stdErrIndices: Array<number> = [];
            const allOutput: Array<string> = [];



            const addTo = (index: Array<number>) => (data: string) => {
                index.push(allOutput.push(data) - 1);
            };

            process.stdout.on('data', addTo(stdOutIndices));
            process.stdout.on('data', data => progress({stdOut: data}));
            process.stderr.on('data', addTo(stdErrIndices));
            process.stderr.on('data', data => progress({stdErr: data}));

            let closed = false;
            let exited = false;

            const attemptToResolvePromise = (processExitCode) => {
                if (closed && exited) {
                    const processResult = new ProcessResult(
                        new BaseProcessResult(completeCommand, processExitCode, null),
                        stdOutIndices,
                        stdErrIndices,
                        allOutput,
                        this.collections
                    );
                    if (processResult.hasError) reject(processResult);
                    else resolve(processResult);
                }
            };

            process.on('close', processExitCode => {
                closed = true;
                attemptToResolvePromise(processExitCode);
            });

            process.on('exit', (processExitCode, signal) => {
                exited = true;
                attemptToResolvePromise(processExitCode);
            });

        });
        const newFuture = this.futures.newFuture.bind(this.futures);
        return {
            kill() {
                return newFuture((resolve, reject) => {
                    process.on('exit', (processExitCode, signal) => {
                        resolve({processExitCode:processExitCode, signal:signal});
                    });
                    process.kill();
                });
            },
            then: futureWithProgress.then.bind(futureWithProgress),
            catch: futureWithProgress.catch.bind(futureWithProgress),
            onProgress: futureWithProgress.onProgress.bind(futureWithProgress)
        };
    }

    executeCommand(command: string, environmentVariables: IDictionary<string>):IChildProcess{
        const env = environmentVariables.clone();
        return this.execute(command, env);
    }

    executeNodeProcess(command:string, environmentVariables:IDictionary<string>):IChildProcess {
        const env = environmentVariables.clone();
        const nodeExecutable = this.pathToNodeJSExecutable;
        env.addOrUpdate('PATH', `${env.get('PATH')}:${nodeExecutable}`);

        return this.execute(`${nodeExecutable} ${command}`, env);
    }

    get processName():string {
        return this.getArgvOrThrow('processName', 1);
    }
}
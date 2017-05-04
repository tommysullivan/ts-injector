import {IList} from "../collections/i-list";
import {IProcessOutputProgress, ISSHSession} from "./i-ssh-session";
import {INodeWrapperFactory} from "../node-js-wrappers/i-node-wrapper-factory";
import {ICollections} from "../collections/i-collections";
import {ISSHResult} from "./i-ssh-result";
import {ISSHError} from "./i-ssh-error";
import {ISSHAPI} from "./i-ssh-api";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {IUUIDGenerator} from "../uuid/i-uuid-generator";
import {IPath} from "../node-js-wrappers/i-path";
import {IErrors} from "../errors/i-errors";
import {IFutures} from "../futures/i-futures";
import {IFuture} from "../futures/i-future";
import {IFutureWithProgress} from "../futures/i-future-with-progress";

export class SSHSession implements ISSHSession {

    constructor(
        private nodemiralSession:any,
        private futures:IFutures,
        private nodeWrapperFactory:INodeWrapperFactory,
        private collections:ICollections,
        private api:ISSHAPI,
        private host:string,
        private writeCommandsToStdout:boolean,
        private fileSystem:IFileSystem,
        private scp2Module:any,
        private username:string,
        private password:string,
        private temporaryStorageLocation:string,
        private uuidGenerator:IUUIDGenerator,
        private path:IPath,
        private errors:IErrors
    ) {}

    executeCommands(...commands:Array<string>):IFuture<IList<ISSHResult>> {
        const commandList = this.collections.newList(commands);
        return this.futures.newFuture((resolve, reject) => {
            const results = this.collections.newEmptyList<ISSHResult>();
            const executeNextCommand:(commandsToExecute:IList<string>) => void = commandsToExecute => {
                const commandToExecute = commandsToExecute.first;
                const remainingCommands = commandsToExecute.rest;
                if(commandToExecute==null) return reject(new Error('Attempted to execute null command'));
                this.executeCommand(commandToExecute)
                    .then(result => {
                        results.push(result);
                        remainingCommands.notEmpty
                            ? executeNextCommand(remainingCommands)
                            : resolve(results);
                    })
                    .catch((sshError:ISSHError)=> {
                        results.push(sshError.sshResult);
                        reject(this.api.newSSHMultiCommandError(results));
                    });
            };
            executeNextCommand(commandList.map(i=>i));
        });
    }

    executeCommand(command:string):IFutureWithProgress<IProcessOutputProgress, ISSHResult> {
        if(this.writeCommandsToStdout) console.log(command);
        return this.futures.newFutureWithProgress((resolve, reject, progress) => {
            this.nodemiralSession.onError(error=>{
                reject(this.api.newSSHError(error, null));
            });
            const options = {
                onStdout: (value) => progress({stdOut:value, stdErr:null}),
                onStderr: (value) => progress({stdOut:null, stdErr:value})
            };
            this.nodemiralSession.execute(command, options, (err:string, code:number, logs:any) => {
                const processResult = this.nodeWrapperFactory.newProcessResultForSeparateStdAndErrorStreams(
                    command,
                    code,
                    this.collections.newList<string>(logs.stdout.split("\n")),
                    this.collections.newList<string>(logs.stderr.split("\n")),
                    err
                );
                const result = this.api.newSSHResult(this.host, processResult);
                if(err) reject(this.api.newSSHError(err, result));
                else if(code!=0) reject(this.api.newSSHError(`Process exited with nonzero exit code: ${code}`, result));
                else resolve(result);
            });
        });
    }

    executeCommandWithRetryTimeout(command:string, timeout:number, maxTryCount:number):IFuture<ISSHResult> {
        return this.executeCommandWithRetryTimeoutInternal(command, timeout, maxTryCount, maxTryCount);
    }

    private executeCommandWithRetryTimeoutInternal(command:string, timeout:number, maxTryCount:number, originalMaxTryCount:number):IFuture<ISSHResult> {
        return this.executeCommand(command)
            .catch(error=>{
                if(maxTryCount==0) throw new Error(
                    `SSH command error after ${originalMaxTryCount} timeouts of ${timeout} milliseconds. Error: ${error.toString()}`
                );
                return this.futures.newDelayedFuture(timeout)
                    .then(_ => this.executeCommandWithRetryTimeoutInternal(
                        command,
                        timeout,
                        maxTryCount - 1,
                        originalMaxTryCount
                    ));
            });
    }

    upload(localPath:string, remotePath:string):IFuture<any> {
        return this.futures.newFuture((resolve, reject) => {
            this.scp2Module.scp(localPath, {path:remotePath}, this.newKeyboardInteractiveClient(), function(err) {
                if(err) reject(err);
                else resolve(null);
            });
        });
    }

    download(remotePath:string, localPath:string):IFuture<void> {
        return this.futures.newFuture<void>((resolve, reject) => {
            const options = {
                host: this.host,
                path: remotePath
            };
            this.scp2Module.scp(options, localPath, this.newKeyboardInteractiveClient(), error => {
                if(error) {
                    try {
                        throw this.errors.newErrorWithCause(error, `remote path: ${remotePath}, local path: ${localPath}`);
                    }
                    catch(e) {
                        reject(e);
                    }
                }
                else resolve();
            });
        });
    }

    private writeGeneral(content:Object, destinationPath:string):IFuture<void> {
        return this.futures.newFuture<void>((resolve, reject) => {
            this.newKeyboardInteractiveClient().write({
                destination: destinationPath,
                content: content
            }, function(err) {
                if(err) reject(err);
                else resolve();
            });
        });
    }

    write(fileContent:string, destinationPath:string):IFuture<any> {
        return this.writeGeneral(
            this.nodeWrapperFactory.newStringBuffer(fileContent),
            destinationPath
        );
    }

    writeAsBinary(fileContent:ArrayBuffer, destinationPath:string):IFuture<void> {
        return this.writeGeneral(
            fileContent,
            destinationPath
        );
    }

    read(remotePath:string):IFuture<string> {
        return this.readAsBinary(remotePath).then(data => data.toString());
    }

    readAsBinary(remotePath:string):IFuture<ArrayBuffer> {
        this.fileSystem.makeDirRecursive(this.temporaryStorageLocation);
        const localPath = this.path.join(this.temporaryStorageLocation, this.uuidGenerator.v4());
        return this.download(remotePath, localPath)
            .then(_ => this.fileSystem.readFileAsBinary(localPath))
            .then(fileContent => this.fileSystem.delete(localPath).then(() => fileContent));
    }

    private newKeyboardInteractiveClient():any {
        const client = new this.scp2Module.Client({
            host: this.host,
            username: this.username,
            password: this.password,
            tryKeyboard: true
        });
        client.on('keyboard-interactive', (name, instr, lang, prompts, cb) => {
            cb([this.password]);
        });
        return client;
    }
}
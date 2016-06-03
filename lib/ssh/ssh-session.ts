import IList from "../collections/i-list";
import ISSHSession from "./i-ssh-session";
import IThenable from "../promise/i-thenable";
import IPromiseFactory from "../promise/i-promise-factory";
import INodeWrapperFactory from "../node-js-wrappers/i-node-wrapper-factory";
import ICollections from "../collections/i-collections";
import ISSHResult from "./i-ssh-result";
import ISSHError from "./i-ssh-error";
import ISSHAPI from "./i-ssh-api";
import IFileSystem from "../node-js-wrappers/i-filesystem";

export default class SSHSession implements ISSHSession {
    private nodemiralSession:any;
    private promiseFactory:IPromiseFactory;
    private nodeWrapperFactory:INodeWrapperFactory;
    private collections:ICollections;
    private api:ISSHAPI;
    private host:string;
    private writeCommandsToStdout:boolean;
    private fileSystem:IFileSystem;
    private scp2Module:any;
    private username:string;
    private password:string;

    constructor(nodemiralSession:any, promiseFactory:IPromiseFactory, nodeWrapperFactory:INodeWrapperFactory, collections:ICollections, api:ISSHAPI, host:string, writeCommandsToStdout:boolean, fileSystem:IFileSystem, scp2Module:any, username:string, password:string) {
        this.nodemiralSession = nodemiralSession;
        this.promiseFactory = promiseFactory;
        this.nodeWrapperFactory = nodeWrapperFactory;
        this.collections = collections;
        this.api = api;
        this.host = host;
        this.writeCommandsToStdout = writeCommandsToStdout;
        this.fileSystem = fileSystem;
        this.scp2Module = scp2Module;
        this.username = username;
        this.password = password;
    }

    executeCommands(commands:IList<string>):IThenable<IList<ISSHResult>> {
        return this.promiseFactory.newPromise((resolve, reject) => {
            var results = this.collections.newEmptyList<ISSHResult>();
            var executeNextCommand:(commandsToExecute:IList<string>) => void = commandsToExecute => {
                var commandToExecute = commandsToExecute.first();
                var remainingCommands = commandsToExecute.rest();
                if(commandToExecute==null) return reject(new Error('Attempted to execute null command'));
                this.executeCommand(commandToExecute)
                    .then(result => {
                        results.push(result);
                        remainingCommands.notEmpty()
                            ? executeNextCommand(remainingCommands)
                            : resolve(results);
                    })
                    .catch((sshError:ISSHError)=> {
                        results.push(sshError.sshResult);
                        reject(this.api.newSSHMultiCommandError(results));
                    });
            };
            executeNextCommand(commands.map(i=>i));
        });
    }

    executeCommand(command:string):IThenable<ISSHResult> {
        if(this.writeCommandsToStdout) console.log(command);
        return this.promiseFactory.newPromise((resolve, reject) => {
            this.nodemiralSession.onError(error=>{
                reject(this.api.newSSHError(error, null));
            });
            this.nodemiralSession.execute(command, (err:string, code:number, logs:any) => {
                var processResult = this.nodeWrapperFactory.newProcessResult(
                    command,
                    code,
                    this.collections.newList<string>(logs.stdout.split("\n")),
                    this.collections.newList<string>(logs.stderr.split("\n")),
                    err
                );
                var result = this.api.newSSHResult(this.host, processResult);
                if(err) reject(this.api.newSSHError(err, result));
                else if(code!=0) reject(this.api.newSSHError(`Process exited with nonzero exit code: ${code}`, result));
                else resolve(result);
            });
        });
    }

    upload(localPath:string, remotePath:string):IThenable<any> {
        return this.promiseFactory.newPromise((resolve, reject) => {
            this.scp2Module.scp(localPath, {path:remotePath}, this.newKeyboardInteractiveClient(), function(err) {
                if(err) reject(err);
                else resolve(null);
            });
        });
    }

    download(remotePath:string, localPath:string):IThenable<any> {
        return this.promiseFactory.newPromise((resolve, reject) => {
            var options = {
                host: this.host,
                path: remotePath
            };
            this.scp2Module.scp(options, localPath, this.newKeyboardInteractiveClient(), function(err) {
                if(err) reject(err);
                else resolve(null);
            });
        });
    }

    write(fileContent:string, destinationPath:string):IThenable<any> {
        return this.promiseFactory.newPromise((resolve, reject) => {
            console.log(`writing file content to "${destinationPath}"`, fileContent);
            this.newKeyboardInteractiveClient().write({
                destination: destinationPath,
                content: this.nodeWrapperFactory.newStringBuffer(fileContent)
            }, function(err) {
                if(err) reject(err);
                else resolve(null);
            });
        });
    }

    private newKeyboardInteractiveClient():any {
        var client = new this.scp2Module.Client({
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
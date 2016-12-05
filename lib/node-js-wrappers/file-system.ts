import {IFileSystem} from "./i-filesystem";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IJSONObject} from "../typed-json/i-json-object";
import {IList} from "../collections/i-list";
import {ICollections} from "../collections/i-collections";
import {IErrors} from "../errors/i-errors";
import {INodeWrapperFactory} from "./i-node-wrapper-factory";
import {IFileStream} from "./i-file-stream";
import {IFileStats} from "./i-file-stats";
import {FileStats} from "./file-stats";
import {IFutures} from "../futures/i-futures";
import {IFuture} from "../futures/i-future";

export class FileSystem implements IFileSystem {
    constructor(
        private fsModule:any,
        private typedJSON:ITypedJSON,
        private collections:ICollections,
        private errors:IErrors,
        private nodeWrapperFactory:INodeWrapperFactory,
        private futures:IFutures,
        private mkdirp:any
    ) {}

    readFileSync(filePath:string):string {
        return this.fsModule.readFileSync(filePath).toString();
    }

    readFileAsBinary(filePath:string):IFuture<ArrayBuffer> {
        return this.futures.newFuture((resolve, reject) => {
            this.fsModule.readFile(filePath, (error, data) => {
                if(error) reject(error);
                else resolve(data);
            });
        })
    }

    readFile(filePath:string):IFuture<string> {
        return this.futures.newFuture((resolve, reject) => {
            this.fsModule.readFile(filePath, (error, data) => {
                if(error) reject(error);
                else resolve(data.toString());
            });
        })
    }

    delete(filePath:string):IFuture<any> {
        return this.futures.newFuture((resolve, reject) => {
            return this.fsModule.unlink(filePath, (error) => {
                if(error) reject(error);
                else resolve(null);
            })
        });
    }

    readdirSync(directoryPath:string):IList<string> {
        return this.collections.newList(<Array<string>>this.fsModule.readdirSync(directoryPath));
    }

    statSync(filePath:string):IFileStats {
        return new FileStats(this.fsModule.statSync(filePath));
    }

    writeFileSync(filePath:string, content:string):IFileSystem {
        this.fsModule.writeFileSync(filePath, content);
        return this;
    }

    writeFile(filePath:string, content:string):IFuture<any>{
        return this.futures.newFuture((resolve, reject) => {
            this.fsModule.writeFile(filePath, content, (error) => {
                if (error) reject(error);
                else resolve(null);
            })
        });
    }

    createReadStream(path:string):IFileStream {
        return this.nodeWrapperFactory.newFileStream(
            this.fsModule.createReadStream(path)
        );
    }

    readJSONFileSync(filePath:string):any {
        try {
            return JSON.parse(this.readFileSync(filePath));
        }
        catch(e) {
            throw this.errors.newErrorWithCause(e, `could not parse or read json at path ${filePath}`);
        }
    }

    private throwWrongTypeError(filePath:string, expectedTypeName):void {
        throw new Error(
            `Expected root JSON object at file "${filePath} to be of type ${expectedTypeName}`
        );
    }

    private readTypedJSONFileSync<T>(filePath:string, expectedTypeName:string):T {
        const rawJSON = this.readJSONFileSync(filePath);
        if(typeof(rawJSON) != expectedTypeName) this.throwWrongTypeError(filePath, expectedTypeName);
        return <T>rawJSON;
    }

    readJSONObjectFileSync(filePath:string):IJSONObject {
        return this.typedJSON.newJSONObject(this.readTypedJSONFileSync<Object>(filePath, 'object'));
    }

    readJSONArrayFileSync(filePath:string):IList<IJSONObject> {
        const rawJSON = <Array<Object>>this.readJSONFileSync(filePath);
        if(!this.typedJSON.isArray(rawJSON)) this.throwWrongTypeError(filePath, 'array');
        return this.collections.newList<IJSONObject>(rawJSON.map(j=>this.typedJSON.newJSONObject(j)));
    }

    checkFileExistSync(filePath:string):boolean {
        return this.fsModule.existsSync(filePath);
    }

    makeDirRecursive(path:string):void {
        this.mkdirp.sync(path);
    }
}
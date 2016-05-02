import IFileSystem from "./i-filesystem";
import ITypedJSON from "../typed-json/i-typed-json";
import IJSONObject from "../typed-json/i-json-object";
import IList from "../collections/i-list";
import ICollections from "../collections/i-collections";
import IErrors from "../errors/i-errors";
import INodeWrapperFactory from "./i-node-wrapper-factory";
import IFileStream from "./i-file-stream";
import IFileStats from "./i-file-stats";
import FileStats from "./file-stats";

export default class FileSystem implements IFileSystem {
    private fsModule:any;
    private typedJSON:ITypedJSON;
    private collections:ICollections;
    private errors:IErrors;
    private nodeWrapperFactory:INodeWrapperFactory;

    constructor(fsModule:any, typedJSON:ITypedJSON, collections:ICollections, errors:IErrors, nodeWrapperFactory:INodeWrapperFactory) {
        this.fsModule = fsModule;
        this.typedJSON = typedJSON;
        this.collections = collections;
        this.errors = errors;
        this.nodeWrapperFactory = nodeWrapperFactory;
    }

    readFileSync(filePath:string):string {
        return <string>this.fsModule.readFileSync(filePath);
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

    createReadStream(path:string):IFileStream {
        return this.nodeWrapperFactory.newFileStream(
            this.fsModule.createReadStream(path)
        );
    }

    readJSONFileSync(filePath:string):any {
        try {
            return JSON.parse(this.fsModule.readFileSync(filePath));
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
        var rawJSON = this.readJSONFileSync(filePath);
        if(typeof(rawJSON) != expectedTypeName) this.throwWrongTypeError(filePath, expectedTypeName);
        return <T>rawJSON;
    }

    readJSONObjectFileSync(filePath:string):IJSONObject {
        return this.typedJSON.newJSONObject(this.readTypedJSONFileSync<Object>(filePath, 'object'));
    }

    readJSONArrayFileSync(filePath:string):IList<IJSONObject> {
        var rawJSON = <Array<Object>>this.readJSONFileSync(filePath);
        if(!this.typedJSON.isArray(rawJSON)) this.throwWrongTypeError(filePath, 'array');
        return this.collections.newList<IJSONObject>(rawJSON.map(j=>this.typedJSON.newJSONObject(j)));
    }
}
import {IJSONObject} from "../typed-json/i-json-object";
import {IList} from "../collections/i-list";
import {IFileStream} from "./i-file-stream";
import {IFileStats} from "./i-file-stats";
import {IFuture} from "../promise/i-future";

export interface IFileSystem {
    delete(filePath:string):IFuture<void>;
    readFile(filePath:string):IFuture<string>;
    readFileAsBinary(filePath:string):IFuture<ArrayBuffer>;
    readFileSync(filePath:string):string;
    readJSONFileSync(filePath:string):Object;
    readJSONObjectFileSync(filePath:string):IJSONObject;
    readJSONArrayFileSync(filePath:string):IList<IJSONObject>;
    createReadStream(path:string):IFileStream;
    writeFileSync(filePath:string, content:string):IFileSystem;
    writeFile(filePath:string, content:string):IFuture<any>;
    readdirSync(directoryPath:string):IList<string>;
    statSync(filePath:string):IFileStats;
    checkFileExistSync(filePath:string):boolean;
}
import IJSONObject from "../typed-json/i-json-object";
import IList from "../collections/i-list";
import IFileStream from "./i-file-stream";
import IFileStats from "./i-file-stats";
import IThenable from "../promise/i-thenable";

interface IFileSystem {
    delete(filePath:string):IThenable<void>;
    readFile(filePath:string):IThenable<string>;
    readFileSync(filePath:string):string;
    readJSONFileSync(filePath:string):Object;
    readJSONObjectFileSync(filePath:string):IJSONObject;
    readJSONArrayFileSync(filePath:string):IList<IJSONObject>;
    createReadStream(path:string):IFileStream;
    writeFileSync(filePath:string, content:string):IFileSystem;
    readdirSync(directoryPath:string):IList<string>;
    statSync(filePath:string):IFileStats;
}

export default IFileSystem;
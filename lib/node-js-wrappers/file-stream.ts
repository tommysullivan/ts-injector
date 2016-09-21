import {IFileStream} from "./i-file-stream";
import {IPipeable} from "./i-pipeable";

export class FileStream implements IFileStream {
    private nativeFileStream:any;

    constructor(nativeFileStream:any) {
        this.nativeFileStream = nativeFileStream;
    }

    pipe(pipeable:IPipeable) {
        this.nativeFileStream.pipe(pipeable);
    }
}
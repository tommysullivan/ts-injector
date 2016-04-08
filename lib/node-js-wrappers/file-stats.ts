import IFileStats from "./i-file-stats";

export default class FileStats implements IFileStats {
    private nativeFileStats:any;

    constructor(nativeFileStats:any) {
        this.nativeFileStats = nativeFileStats;
    }

    get mtime():Date {
        return this.nativeFileStats.mtime;
    }

    get size():number {
        return this.nativeFileStats.size;
    }
}
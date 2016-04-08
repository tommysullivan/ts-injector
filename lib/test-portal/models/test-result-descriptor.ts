import IFileStats from "../../node-js-wrappers/i-file-stats";

export default class TestResultDescriptor {
    private urlFriendlyName:string;
    private fullPath:string;
    private fileStats:IFileStats;

    constructor(urlFriendlyName:string, fullPath:string, fileStats:IFileStats) {
        this.urlFriendlyName = urlFriendlyName;
        this.fullPath = fullPath;
        this.fileStats = fileStats;
    }

    get modifiedTime():number { return this.fileStats.mtime.getTime(); }
    get size():number { return this.fileStats.size; }

    toJSON():any {
        return {
            name: this.urlFriendlyName,
            href: this.urlFriendlyName,
            fullPath: this.fullPath,
            modifiedTime: this.modifiedTime,
            size: this.size
        }
    }
}
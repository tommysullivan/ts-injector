import IList from "../collections/i-list";

export default class NodeLog {
    constructor(
        private nodeHost:string,
        private logContent:Array<string>,
        private logTitle:string
    ) {}

    toJSON():any {
        return {
            logTitle: this.logTitle,
            nodeHost: this.nodeHost,
            logContent: this.logContent,
        }
    }
}
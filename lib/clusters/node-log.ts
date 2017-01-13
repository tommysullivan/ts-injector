import {IJSONValue} from "../typed-json/i-json-value";
export class NodeLog {
    constructor(
        private nodeHost:string,
        private logContent:Array<string>,
        private logTitle:string
    ) {}

    toJSON():IJSONValue {
        return {
            logTitle: this.logTitle,
            nodeHost: this.nodeHost,
            logContent: this.logContent,
        }
    }
}
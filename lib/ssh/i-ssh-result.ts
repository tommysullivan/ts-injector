import IProcessResult from "../node-js-wrappers/i-process-result";

interface ISSHResult {
    host():string
    processResult():IProcessResult;
    toJSON():any;
    toJSONString():string;
    toString():string;
}

export default ISSHResult;
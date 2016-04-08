import IThenable from "./i-thenable";
import IList from "../collections/i-list";

interface IPromiseFactory {
    newPromiseForRejectedImmediateValue<T>(value:T):IThenable<T>;
    newPromiseForImmediateValue<T>(value:T):IThenable<T>;
    newPromise<T>(resolver:(resolve: (value: T) => void, reject: (reason: any) => void) => void):IThenable<T>;
    newGroupPromise<T>(promises:IList<IThenable<T>>):IThenable<IList<T>>;
}

export default IPromiseFactory;
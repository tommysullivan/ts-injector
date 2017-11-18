import {IClass, IFunctionSignature, IInterface} from "./interfaces";
import {IList} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-list";

export class Interface<T> implements IInterface<T> {
    constructor(
        public readonly name:string,
        public readonly implementations: IList<IClass<T>>
    ) {}

    isNonFunctionPrimitive = false;
    isClass = false;
    isInterface = true;
    isFunction = false;

    toString():string {
        return `Interface { name: ${this.name} }`;
    }

    equals(other:IInterface<T>):boolean {
        return this.name == other.name;
    }

    get asClass():IClass<T> {
        throw new TypeError(`Tried to cast interface type to class type. Interface type: ${this}`);
    }

    get asInterface():IInterface<T> {
        return this as IInterface<T>;
    }

    get asFunctionSignature():IFunctionSignature<T> {
        throw new TypeError(`Tried to cast interface type to function signature type. Interface type: ${this}`);
    }
}
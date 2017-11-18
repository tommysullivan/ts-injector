import {IArgument, IFunctionSignature, IInterface, IClass, IType} from "./interfaces";
import {IList} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-list";

export class FunctionSignature<T> implements IFunctionSignature<T> {
    constructor(
        public readonly args: IList<IArgument<any>>,
        public readonly returnType: IType<T>
    ) {}

    isNonFunctionPrimitive = false;
    isClass = false;
    isInterface = false;
    isFunction = true;

    get asClass(): IClass<T> {
        throw new TypeError(`Tried to cast function signature as a class. ${this}`)
    }

    get asInterface(): IInterface<T> {
        throw new TypeError(`Tried to cast function signature as an interface. ${this}`)
    }

    get asFunctionSignature():IFunctionSignature<T> {
        return this as IFunctionSignature<T>;
    }

    invoke(args: any[]): T {
        return null;
    }

    toString():string {
        return `FunctionSignature { args: ${this.args.join(',')}, returnType: ${this.returnType} }`;
    }
}
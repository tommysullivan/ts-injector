import {IArgument, IFunctionSignature, IInterface, IClass, IType} from "./interfaces";
import {IList} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-list";
import {NotImplementedError} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/errors/not-implemented-error";

export class FunctionSignature<T> implements IFunctionSignature<T> {
    constructor(
        public readonly args: IList<IArgument<any>>,
        public readonly returnType: IType<T>
    ) {}

    readonly kind = 'IFunctionSignature';

    toString():string {
        return `FunctionSignature { args: ${this.args.join(',')}, returnType: ${this.returnType} }`;
    }

    isPartialFunction<OtherType>(other:IFunctionSignature<OtherType>):boolean {
        //TODO: Why are we implementing this?

        throw new NotImplementedError();
    }
}
import {IClass, IFunctionSignature, IInterface} from "./interfaces";
import {IList} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-list";

export class Interface<T> implements IInterface<T> {
    constructor(
        public readonly name:string,
        public readonly implementations: IList<IClass<T>>
    ) {}

    readonly kind = 'IInterface';

    toString():string {
        return `Interface { name: ${this.name} }`;
    }

    equals(other:IInterface<T>):boolean {
        return this.name == other.name;
    }
}
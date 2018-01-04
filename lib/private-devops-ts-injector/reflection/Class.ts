import {IClass, IConstructor, NativeClassReference} from "./interfaces";

export class Class<T> implements IClass<T> {
    constructor(
        public readonly theConstructor:IConstructor<T>,
        public readonly nativeTypeReference: NativeClassReference<T>
    ) {}

    readonly kind = 'IClass';

    get name():string {
        return this.nativeTypeReference.prototype.constructor.name;
    }

    toString():string {
        return `Class { name: ${this.name} kind: ${this.kind}`;
    }
}
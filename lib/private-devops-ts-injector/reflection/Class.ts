import {IClass, IConstructor, NativeClassReference} from "./interfaces";

export class Class<T> implements IClass<T> {
    constructor(
        public readonly constructor:IConstructor<T>,
        public readonly nativeTypeReference: NativeClassReference<T>
    ) {}

    get name():string {
        return this.nativeTypeReference.prototype.constructor.name;
    }

    isPrimitive = false;
    isClass = true;
    isInterface = false;

    toString():string {
        return `Class { name: ${this.name} }`;
    }
}
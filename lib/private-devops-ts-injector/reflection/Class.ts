import {IClass, IConstructor, IFunctionSignature, IInterface, NativeClassReference} from "./interfaces";

export class Class<T> implements IClass<T> {
    constructor(
        public readonly theConstructor:IConstructor<T>,
        public readonly nativeTypeReference: NativeClassReference<T>
    ) {}

    get name():string {
        return this.nativeTypeReference.prototype.constructor.name;
    }

    isNonFunctionPrimitive = false;
    isClass = true;
    isInterface = false;
    isFunction = false;

    toString():string {
        return `Class { name: ${this.name} }`;
    }

    get asInterface():IInterface<T> {
        throw new TypeError(`Tried to cast class type to interface type. Class type: ${this}`);
    }

    get asClass():IClass<T> {
        return this as IClass<T>;
    }

    get asFunctionSignature():IFunctionSignature<T> {
        throw new TypeError(`Tried to cast class type to function signature type. Class type: ${this}`);
    }
}
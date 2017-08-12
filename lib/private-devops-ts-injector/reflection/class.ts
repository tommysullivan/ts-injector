import {IClass, IClassMetadata, IConstructor, IReflector, ITypesMetadata, NativeClassReference} from "./interfaces";
import {Constructor} from "./constructor";
import {InvalidClassMatchError} from "../dependency-injection/injector";

export class Class<T> implements IClass<T> {
    constructor(
        public readonly nativeTypeReference: NativeClassReference<T>,
        private readonly typesMetadata:ITypesMetadata,
        private readonly reflector:IReflector
    ) {}

    getConstructor(): IConstructor<T> {
        return new Constructor(
            this.nativeTypeReference, this.classMetadata.constructorArgs,
            this.reflector
        );
    }

    private get classMetadata():IClassMetadata {
        const potentialMatches = this.typesMetadata.classes.filter(classMD => classMD.name == this.name);
        InvalidClassMatchError.throwIfNotExactlyOneMatch(this.name, potentialMatches);
        return potentialMatches[0];
    }

    get name():string {
        return this.nativeTypeReference.prototype.constructor.name;
    }

    isPrimitive = false;
    isClass = true;
}
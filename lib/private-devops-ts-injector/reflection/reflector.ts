import {
    IClass,
    IReflector, ITypesMetadata,
    NativeClassReference
} from "./interfaces";
import {Class} from "./class";
import {InvalidClassMatchError} from "../dependency-injection/injector";

export class Reflector implements IReflector {

    constructor(
        private readonly typesMetadata:ITypesMetadata,
        private readonly nativeClassReferences:NativeClassReference<any>[]
    ) {}

    private newClass<T>(someClass: NativeClassReference<T>): IClass<T> {
        return new Class(someClass, this.typesMetadata, this);
    }

    classOf<T>(someClass: NativeClassReference<T>): IClass<T> {
        return this.newClass(someClass);
    }

    nativeClassWithName(soughtClassName:string):NativeClassReference<any> {
        const potentialMatches = this.nativeClassesWithName(soughtClassName);
        InvalidClassMatchError.throwIfNotExactlyOneMatch(soughtClassName, potentialMatches);
        return potentialMatches[0];
    }

    private nativeClassesWithName(soughtClassName:string):NativeClassReference<any>[] {
        return this.nativeClassReferences.filter(ncr => this.newClass(ncr).name == soughtClassName);
    }

    hasClassWithName(soughtClassName:string):boolean {
        return this.nativeClassesWithName(soughtClassName).length > 0;
    }
}
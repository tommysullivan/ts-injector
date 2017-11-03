import {ErrorWithCause} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/errors/error-with-cause";
import {IArgument, IClass, IReflector, IType, NativeClassReference} from "../reflection/interfaces";

export interface IInjector {
    createInstanceOf<ClassToInstantiate>(theClass:NativeClassReference<ClassToInstantiate>):ClassToInstantiate;
    createInstanceFromIClass<ClassToInstantiate>(theClass:IClass<ClassToInstantiate>):ClassToInstantiate;
}

export class InvalidClassMatchError extends Error {
    constructor(className:string, potentialMatches:any[]) {
        super(`Exactly one class with name "${className}" sought, found ${potentialMatches.length}.`)
    }

    static throwIfNotExactlyOneMatch(className:string, potentialMatches:any[]):any {
        if(potentialMatches.length != 1) throw new InvalidClassMatchError(className, potentialMatches)
    }
}

export interface IArgumentValueResolver {
    resolveArgumentValue(arg:IArgument):any;
    canResolveArgumentValue(arg:IArgument):boolean;
    // instanceForType(type: IType, injector:IInjector):any;
    // instanceForTypeWhenAutomaticConstructionFails(type:IType):any;
}

export class Injector implements IInjector {
    constructor(
        private readonly reflector:IReflector,
        private readonly argumentValueResolver:IArgumentValueResolver
    ) {}

    createInstanceOf<ClassToInstantiate>(nativeClassReference: NativeClassReference<ClassToInstantiate>): ClassToInstantiate {
        try {
           return this.createInstanceFromIClass(this.reflector.classOf(nativeClassReference));
        }
        catch(e) {
            throw new ErrorWithCause(
                [
                    `Tried to create class instance for a native class reference, but encountered a problem`,
                    `nativeClassReference: ${nativeClassReference.name}`
                ].join("\n"),
                e
            );
        }
    }

    createInstanceFromIClass<ClassToInstantiate>(theClass: IClass<ClassToInstantiate>): ClassToInstantiate {
        try {
            const theConstructor = theClass.constructor;
            const constructorParameters = theConstructor.args.map(
                arg => this.argumentValueResolver.resolveArgumentValue(arg)
            );
            return theConstructor.invoke(constructorParameters.toArray());
        }
        catch(e) {
            throw new ErrorWithCause(
                [
                    `Tried to create class instance using an IClass, but encountered a problem`,
                    `IClass: ${theClass}`
                ].join("\n"),
                e
            );
        }
    }
}
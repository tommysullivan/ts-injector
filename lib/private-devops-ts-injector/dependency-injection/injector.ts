import {ErrorWithCause} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/errors/error-with-cause";
import {IArgument, IReflector, IType, NativeClassReference} from "../reflection/interfaces";

export interface IInjector {
    createInstanceOf<ClassToInstantiate>(theClass:NativeClassReference<ClassToInstantiate>):ClassToInstantiate;
    argumentValue(argDescription:IArgument):any;
}

export class InvalidClassMatchError extends Error {
    constructor(className:string, potentialMatches:any[]) {
        super(`Exactly one class with name "${className}" sought, found ${potentialMatches.length}.`)
    }

    static throwIfNotExactlyOneMatch(className:string, potentialMatches:any[]):any {
        if(potentialMatches.length != 1) throw new InvalidClassMatchError(className, potentialMatches)
    }
}

export interface ICustomValueResolver {
    instanceForType(type: IType, injector:IInjector):any;
    resolveArgumentValue(arg:IArgument):any;
    instanceForTypeWhenAutomaticConstructionFails(type:IType):any;
}

export class Injector implements IInjector {
    constructor(
        private readonly reflector:IReflector,
        private readonly customValueResolver:ICustomValueResolver
    ) {}

    createInstanceOf<ClassToInstantiate>(nativeClassReference: NativeClassReference<ClassToInstantiate>): ClassToInstantiate {
        const theClass = this.reflector.classOf(nativeClassReference);
        try {
            const potentialInstance = this.customValueResolver.instanceForType(theClass, this);
            if(potentialInstance) return potentialInstance;
            const theConstructor = theClass.getConstructor();
            try {
                const constructorParameters = theConstructor.args.map(argDescription => this.argumentValue(argDescription));
                return theConstructor.invoke(constructorParameters);
            }
            catch(e) {
                const potentialInstance = this.customValueResolver.instanceForTypeWhenAutomaticConstructionFails(theClass);
                if(potentialInstance==null) throw new ErrorWithCause(`Could not construct automatically due to error, also could not custom construct.`, e);
                return potentialInstance;
            }
        }
        catch(e) {
            throw new ErrorWithCause(`Problem creating instance of ${theClass.name}`, e);
        }
    }

    argumentValue(argDescription:IArgument):any {
        try {
            return argDescription.type.isPrimitive
                ? this.customValueResolver.resolveArgumentValue(argDescription)
                : this.valueForNonPrimitive(argDescription);
        }
        catch(e) {
            throw new ErrorWithCause(`Problem determining appropriate value for: ${argDescription}`, e)
        }
    }

    private valueForNonPrimitive(argDescription:IArgument):any {
        const resolvedValue = argDescription.type.isClass
            ? this.createInstanceOf(argDescription.type.nativeTypeReference)
            : this.valueForNonPrimitiveAbstraction(argDescription);
        if(resolvedValue==null) throw new Error(`Could not resolve value for argument ${argDescription}`);
        return resolvedValue;
    }

    private valueForNonPrimitiveAbstraction(argDescription:IArgument):any {
        const potentialInstance = this.customValueResolver.instanceForType(argDescription.type, this);
        if(potentialInstance) return potentialInstance;
        return this.customValueResolver.resolveArgumentValue(argDescription);
    }
}
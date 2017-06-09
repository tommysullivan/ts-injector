import {ErrorWithCause} from "../errors/error-with-cause";

export interface NativeClassReference<T> {
    new (...args:any[]):T;
}

export interface IInjector {
    createInstanceOf<ClassToInstantiate>(theClass:NativeClassReference<ClassToInstantiate>):ClassToInstantiate;
    argumentValue(argDescription:IArgument):any;
}

export interface IType {
    isPrimitive:boolean;
    isClass:boolean;
    nativeTypeReference:any;
    name:string;
}

export interface IArgument {
    type:IType;
    name:string;
    index:number;
    position:number;
}

export interface IReflector {
    classOf<T>(someClass:NativeClassReference<T>):IClass<T>;
    nativeClassWithName(className:string):NativeClassReference<any>;
    hasClassWithName(soughtClassName:string):boolean;
}

export interface IClass<T> extends IType {
    getConstructor():IConstructor<T>;
    name:string;
}

export interface IConstructor<T>{
    invoke(args:any[]):T;
    args:IArgument[];
}

export class Argument implements IArgument {
    constructor(
        private readonly argMetadata:IArgumentMetadata,
        private readonly reflector:IReflector,
        public readonly index:number
    ) {}

    get type(): IType {
        return new Type(
            this.argMetadata.typeName,
            this.reflector
        )
    }

    get name():string {
        return this.argMetadata.name;
    }

    get position():number {
        return this.index + 1;
    }

    toString():string {
        return `Argument ${this.position}, "${this.name}" (of type ${this.type.name})`;
    }
}

export class Type implements IType {
    constructor(
        public readonly name:string,
        private readonly reflector:IReflector
    ) {}

    private readonly primitiveTypeNames = [
        'boolean',
        'number',
        'string',
        'object',
        'array'
    ];

    get isPrimitive(): boolean {
        return this.primitiveTypeNames.indexOf(this.name) >= 0;
    }

    get nativeTypeReference(): any {
        return this.reflector.nativeClassWithName(this.name);
    }

    get isClass():boolean {
        return this.reflector.hasClassWithName(this.name);
    }
}

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

export class InvalidClassMatchError extends Error {
    constructor(className:string, potentialMatches:any[]) {
        super(`Exactly one class with name "${className}" sought, found ${potentialMatches.length}.`)
    }

    static throwIfNotExactlyOneMatch(className:string, potentialMatches:any[]):any {
        if(potentialMatches.length != 1) throw new InvalidClassMatchError(className, potentialMatches)
    }
}

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

export class Constructor<T> implements IConstructor<T> {
    constructor(
        private readonly theClass: NativeClassReference<T>,
        private readonly constructorArgs:IArgumentMetadata[],
        private readonly reflector:IReflector
    ) {}

    invoke(args: any[]): T {
        return new this.theClass(...args);
    }

    get args(): IArgument[] {
        return this.constructorArgs.map((argMD, index) => new Argument(argMD, this.reflector, index));
    }
}

export interface ITypesMetadata {
    classes:IClassMetadata[];
}

export interface IClassMetadata {
    name: string,
    constructorArgs: IArgumentMetadata[];
}

export interface IArgumentMetadata {
    name: string,
    typeName: string
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
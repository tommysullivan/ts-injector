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

export interface NativeClassReference<T> {
    new (...args:any[]):T;
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
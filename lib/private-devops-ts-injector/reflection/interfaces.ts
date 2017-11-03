import {IList} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-list";

export interface IType {
    isPrimitive:boolean;
    isClass:boolean;
    isInterface:boolean;
    nativeTypeReference:any;
    name:string;
}

export interface IArgument {
    type:IType;
    name:string;
    index:number;
    position:number;
    isOptional:boolean;
}

export interface IReflector {
    classOf<T>(someClass:NativeClassReference<T>):IClass<T>;
    interface<T>(interfaceType:IType):IInterface<T>;
}

export interface IClass<T> extends IType {
    constructor:IConstructor<T>;
    name:string;
}

export interface IInterface<T> extends IType {
    implementations:IList<IClass<T>>;
}

export interface IConstructor<T>{
    invoke(args:any[]):T;
    args:IList<IArgument>;
}

export interface NativeClassReference<T> {
    new (...args:any[]):T;
}

export interface IReflectionDigest {
    classes:IList<IClass<any>>;
    interfaces:IList<IInterface<any>>;
}

// export interface ITypesMetadata {
//     classes:IClassMetadata[];
// }
//
// export interface IClassMetadata {
//     name: string,
//     constructorArgs: IArgumentMetadata[];
// }
//
// export interface IArgumentMetadata {
//     name: string,
//     typeName: string,
//     isOptional: boolean
// }
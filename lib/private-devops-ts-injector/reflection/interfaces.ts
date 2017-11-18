import {IList} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-list";

export interface IValueProvider<TDecisionCriteria, TypeOfValueDesired> {
    provideValueBasedOn(decisionCriteria:TDecisionCriteria):TypeOfValueDesired;
    canProvideValueBasedOn(decisionCriteria:TDecisionCriteria):boolean;
}

export type IValueProviderBasedOnArgument<TypeOfValueDesired> = IValueProvider<IArgument<any>, TypeOfValueDesired>;
export type IValueProviderBasedOnIClass<TypeOfValueDesired> = IValueProvider<IClass<any>, TypeOfValueDesired>;
export type IValueProviderBasedOnFunction<TypeOfValueDesired> = IValueProvider<IFunctionSignature<any>, TypeOfValueDesired>;
export type IValueProviderBasedOnInterface<TypeOfValueDesired> = IValueProvider<IInterface<any>, TypeOfValueDesired>;

export interface IType<T> {
    isFunction:boolean;
    isNonFunctionPrimitive:boolean;
    isClass:boolean;
    isInterface:boolean;
    asClass:IClass<T>;
    asInterface:IInterface<T>;
    asFunctionSignature:IFunctionSignature<T>;
}

export interface IArgument<T> {
    type:IType<T>;
    name:string;
    index:number;
    position:number;
    isOptional:boolean;
}

export interface IReflector {
    classOf<T>(someClass:NativeClassReference<T>):IClass<T>;
}

export interface IClass<T> extends IType<T> {
    theConstructor:IConstructor<T>;
    name:string; //
}

export interface IInterface<T> extends IType<T> {
    implementations:IList<IClass<T>>;
    equals(other:IInterface<T>):boolean;
    name:string;
}

export interface IFunctionSignature<ReturnType> extends IType<ReturnType> {
    args:IList<IArgument<any>>;
    returnType:IType<ReturnType>;
}

export interface IFunction<ReturnType> {
    invoke(args:any[]):ReturnType;
    signature:IFunctionSignature<ReturnType>
}

export interface IConstructor<T>{
    invoke(...args:any[]):T;
    args:IList<IArgument<any>>;
}

export interface NativeClassReference<T> {
    new (...args:any[]):T;
}

export interface IReflectionDigest {
    classes:IList<IClass<any>>;
    interfaces:IList<IInterface<any>>;
    functionSignatures:IList<IFunctionSignature<any>>;
}
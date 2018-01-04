import {IList} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-list";

export interface IValueProvider<TDecisionCriteria extends IDecisionCriteria<TypeOfValueDesired>, TypeOfValueDesired> {
    provideValueBasedOn(decisionCriteria:TDecisionCriteria):TypeOfValueDesired;
    canProvideValueBasedOn(decisionCriteria:IDecisionCriteria<TypeOfValueDesired>):boolean;
}

export type IValueProviderBasedOnArgument<TypeOfValueDesired> = IValueProvider<IArgument<any>, TypeOfValueDesired>;
export type IValueProviderBasedOnIClass<TypeOfValueDesired> = IValueProvider<IClass<TypeOfValueDesired>, TypeOfValueDesired>;
export type IValueProviderBasedOnFunctionSignature<TypeOfValueDesired> = IValueProvider<IFunctionSignature<TypeOfValueDesired>, TypeOfValueDesired>;
export type IValueProviderBasedOnInterface<TypeOfValueDesired> = IValueProvider<IInterface<TypeOfValueDesired>, TypeOfValueDesired>;
export type IValueProviderBasedOnType<TypeOfValueDesired> = IValueProvider<IType<TypeOfValueDesired>, TypeOfValueDesired>;

export type IDecisionCriteria<T> = IType<T> | IArgument<T>;
export type IType<T> = IInterface<T> | IClass<T> | IVoid | IFunctionSignature<T>;

export interface IVoid {
    kind: 'IVoid'
}

export interface IArgument<T> {
    kind: 'IArgument',
    type:IType<T>;
    name:string;
    index:number;
    position:number;
    isOptional:boolean;
}

export interface IReflector {
    classOf<T>(someClass:NativeClassReference<T>):IClass<T>;
}

export interface IClass<T> {
    kind: 'IClass',
    theConstructor:IConstructor<T>;
    name:string;
}

export interface IInterface<TActualInterfaceType> {
    kind: 'IInterface',
    implementations:IList<IClass<TActualInterfaceType>>;
    equals(other:IInterface<TActualInterfaceType>):boolean;
    name:string;
}

export interface IFunctionSignature<ReturnType> {
    kind: 'IFunctionSignature',
    args:IList<IArgument<any>>;
    returnType:IType<ReturnType>;
    isPartialFunction<OtherType>(other:IFunctionSignature<OtherType>):boolean;
}

export interface IFunction<ReturnType> {
    invoke(args:any[]):ReturnType;
    signature:IFunctionSignature<ReturnType>;
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
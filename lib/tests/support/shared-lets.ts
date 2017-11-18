import {Let} from "mocha-let-ts";
import {Reflector} from "../../private-devops-ts-injector/reflection/Reflector";
import {PrimitivesForNodeJS} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/api/nodejs/primitives-for-node-js";
import {ArgumentValueResolverMultiplexer} from "../../private-devops-ts-injector/dependency-injection/ArgumentValueResolverMultiplexer";
import {ValueProviderUsingDictionaryWhereKeyIsArgumentName} from "../../private-devops-ts-injector/dependency-injection/ArgumentValueResolverBasedOnArgumentName";
import {ValueProviderBasedOnIClass} from "../../private-devops-ts-injector/dependency-injection/ValueProviderBasedOnIClass";
import {
    IValueProviderBasedOnArgument,
    IReflectionDigest
} from "../../private-devops-ts-injector/reflection/interfaces";
import {ReflectionDigestForTesting} from "./fake-types/ReflectionDigestForTesting";
import {ValueProviderBasedOnClass} from "../../private-devops-ts-injector/dependency-injection/ValueProviderBasedOnClass";

export const reflectionDigest = Let<IReflectionDigest>(() => new ReflectionDigestForTesting(collections()));
export const reflector = Let(() => new Reflector(reflectionDigest()));
export const valueProviderBasedOnIClass = Let(() => new ValueProviderBasedOnIClass(argumentValueResolver()));
export const valueProviderBasedOnClass = Let(() => new ValueProviderBasedOnClass(reflector(), valueProviderBasedOnIClass()));
export const primitives = Let(() => new PrimitivesForNodeJS());
export const collections = Let(() => primitives().collections);
export const argumentValueResolvers = Let(() => [
    new ValueProviderUsingDictionaryWhereKeyIsArgumentName(argumentNameValueDictionary())
]);
export const argumentNameValueJSON = Let(() => ({
    arg1: 'val1'
}));
export const argumentNameValueDictionary = Let(() => collections().newDictionary(argumentNameValueJSON()));
export const argumentValueResolversList = Let(() => collections().newList(argumentValueResolvers()));
export const argumentValueResolver = Let<IValueProviderBasedOnArgument<any>>(
    () => new ArgumentValueResolverMultiplexer(argumentValueResolversList())
);

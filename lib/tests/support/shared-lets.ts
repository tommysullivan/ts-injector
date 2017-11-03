import {
    IArgumentValueResolver, IInjector,
    Injector
} from "../../private-devops-ts-injector/dependency-injection/Injector";
import {Let} from "mocha-let-ts";
import {Reflector} from "../../private-devops-ts-injector/reflection/Reflector";
import {PrimitivesForNodeJS} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/api/nodejs/primitives-for-node-js";
import {ArgumentValueResolverMultiplexer} from "../../private-devops-ts-injector/dependency-injection/ArgumentValueResolverMultiplexer";
import {ArgumentValueResolverBasedOnArgumentName} from "../../private-devops-ts-injector/dependency-injection/ArgumentValueResolverBasedOnArgumentName";
import {ArgumentValueResolverForInterfaces} from "../../private-devops-ts-injector/dependency-injection/ArgumentValueResolverForInterfaces";
import {ArgumentValueResolverForClass} from "../../private-devops-ts-injector/dependency-injection/ArgumentValueResolverForClass";
import {InjectorProxy} from "../../private-devops-ts-injector/dependency-injection/InjectorProxy";
import {IReflectionDigest} from "../../private-devops-ts-injector/reflection/interfaces";
import {ReflectionDigestForTesting} from "./fake-types/ReflectionDigestForTesting";

export const injectorProxy = Let<IInjector>(() => new InjectorProxy(() => injector()));
export const reflectionDigest = Let<IReflectionDigest>(() => new ReflectionDigestForTesting());
export const reflector = Let(() => new Reflector(reflectionDigest()));
export const injector = Let(() => new Injector(reflector(), argumentValueResolver()));
export const primitives = Let(() => new PrimitivesForNodeJS());
export const collections = Let(() => primitives().collections);
export const argumentValueResolvers = Let(() => [
    new ArgumentValueResolverForClass(injectorProxy()),
    new ArgumentValueResolverForInterfaces(reflector(), injectorProxy()),
    new ArgumentValueResolverBasedOnArgumentName(argumentNameValueDictionary())
]);
export const argumentNameValueJSON = Let(() => ({
    arg1: 'val1'
}));
export const argumentNameValueDictionary = Let(() => collections().newDictionary(argumentNameValueJSON()));
export const argumentValueResolversList = Let(() => collections().newList(argumentValueResolvers()));
export const argumentValueResolver = Let<IArgumentValueResolver>(
    () => new ArgumentValueResolverMultiplexer(argumentValueResolversList())
);

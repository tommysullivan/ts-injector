import {Reflector} from "../../private-devops-ts-injector/reflection/Reflector";
import {PrimitivesForNodeJS} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/api/nodejs/primitives-for-node-js";
import {ValueProviderUsesFirstWorkableProvider} from "../../private-devops-ts-injector/injection/ValueProviderUsesFirstWorkableProvider";
import {ValueProviderUsingDictionaryWhereKeyIsArgumentName} from "../../private-devops-ts-injector/injection/ValueProviderUsingDictionaryWhereKeyIsArgumentName";
import {ValueProviderBasedOnIClass} from "../../private-devops-ts-injector/injection/ValueProviderBasedOnIClass";
import {IReflectionDigest} from "../../private-devops-ts-injector/reflection/interfaces";
import {ValueProviderBasedOnClass} from "../../private-devops-ts-injector/injection/ValueProviderBasedOnClass";
import {ValueProviderBasedOnInterface} from "../../private-devops-ts-injector/injection/ValueProviderBasedOnInterface";
import {ValueProviderUsesTypeOfArgument} from "../../private-devops-ts-injector/injection/ValueProviderUsesTypeOfArgument";
import {ValueProviderProxy} from "../../private-devops-ts-injector/injection/ValueProviderProxy";
import {IDictionary} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-dictionary";


export const collections = new PrimitivesForNodeJS().collections;


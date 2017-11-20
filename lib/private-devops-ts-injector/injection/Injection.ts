import {IDictionary} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-dictionary";
import {ValueProviderBasedOnInterface} from "./ValueProviderBasedOnInterface";
import {ValueProviderProxy} from "./ValueProviderProxy";
import {ValueProviderBasedOnIClass} from "./ValueProviderBasedOnIClass";
import {ValueProviderUsesFirstWorkableProvider} from "./ValueProviderUsesFirstWorkableProvider";
import {ICollections} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-collections";
import {ValueProviderUsingDictionaryWhereKeyIsArgumentName} from "./ValueProviderUsingDictionaryWhereKeyIsArgumentName";
import {ValueProviderUsesTypeOfArgument} from "./ValueProviderUsesTypeOfArgument";
import {
    IReflectionDigest, IType, IValueProvider, IValueProviderBasedOnClass,
    IValueProviderBasedOnIClass, IValueProviderBasedOnInterface
} from "../reflection/interfaces";
import {ValueProviderBasedOnClass} from "./ValueProviderBasedOnClass";
import {Reflector} from "../reflection/Reflector";

export class Injection {
    constructor(
        private readonly collections:ICollections,
        private readonly argumentNameToValueDictionaryProvider:() => IDictionary<any>
    ) {}

    valueProviderBasedOnInterface<T>():IValueProviderBasedOnInterface<T> {
        return new ValueProviderBasedOnInterface(
            new ValueProviderProxy(
                () => this.valueProviderBasedOnIClass<T>()
            )
        )
    }

    //TODO: Eliminate any - fixing this will force the correct type definitions for IDecisionCriteria
    valueProviderBasedOnIType<T>():IValueProvider<IType<T>, T> {
        return new ValueProviderUsesFirstWorkableProvider(
            this.collections.newList<IValueProvider<IType<any>, any>>([
                new ValueProviderProxy(
                    () => this.valueProviderBasedOnIClass()
                ),
                this.valueProviderBasedOnInterface()
            ])
        )
    }

    valueProviderBasedOnIClass<T>():IValueProviderBasedOnIClass<T> {
        return new ValueProviderBasedOnIClass<T>(
            new ValueProviderUsesFirstWorkableProvider(
                this.collections.newList([
                    new ValueProviderUsingDictionaryWhereKeyIsArgumentName(this.argumentNameToValueDictionaryProvider()),
                    new ValueProviderUsesTypeOfArgument(
                        this.valueProviderBasedOnIType()
                    )
                    //TODO: Test whether a non argument type of provider would cause a compiler error (if not, a runtime?)
                ])
            )
        )
    }

    valueProviderBasedOnClass<T>(reflectionDigest:IReflectionDigest):IValueProviderBasedOnClass<T> {
        return new ValueProviderBasedOnClass<T>(
            new Reflector(
                reflectionDigest
            ),
            this.valueProviderBasedOnIClass<T>()
        )
    }

}
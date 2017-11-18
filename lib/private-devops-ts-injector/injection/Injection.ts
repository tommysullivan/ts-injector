import {IDictionary} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-dictionary";
import {ValueProviderBasedOnInterface} from "./ValueProviderBasedOnInterface";
import {ValueProviderProxy} from "./ValueProviderProxy";
import {ValueProviderBasedOnIClass} from "./ValueProviderBasedOnIClass";
import {ValueProviderUsesFirstWorkableProvider} from "./ValueProviderUsesFirstWorkableProvider";
import {ICollections} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-collections";
import {ValueProviderUsingDictionaryWhereKeyIsArgumentName} from "./ValueProviderUsingDictionaryWhereKeyIsArgumentName";
import {ValueProviderUsesTypeOfArgument} from "./ValueProviderUsesTypeOfArgument";
import {IReflectionDigest, IType, IValueProvider} from "../reflection/interfaces";
import {ValueProviderBasedOnClass} from "./ValueProviderBasedOnClass";
import {Reflector} from "../reflection/Reflector";

export class Injection {
    constructor(
        private readonly collections:ICollections,
        private readonly argumentNameToValueDictionaryProvider:() => IDictionary<any>
    ) {}

    valueProviderBasedOnInterface<T>():ValueProviderBasedOnInterface<T> {
        return new ValueProviderBasedOnInterface(
            new ValueProviderProxy(
                () => this.valueProviderBasedOnIClass()
            )
        )
    }

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

    valueProviderBasedOnIClass():ValueProviderBasedOnIClass<any> {
        return new ValueProviderBasedOnIClass(
            new ValueProviderUsesFirstWorkableProvider(
                this.collections.newList([
                    new ValueProviderUsingDictionaryWhereKeyIsArgumentName(this.argumentNameToValueDictionaryProvider()),
                    new ValueProviderUsesTypeOfArgument(
                        this.valueProviderBasedOnIType()
                    )
                ])
            )
        )
    }

    valueProviderBasedOnClass<T>(reflectionDigest:IReflectionDigest):ValueProviderBasedOnClass<T> {
        return new ValueProviderBasedOnClass(
            new Reflector(
                reflectionDigest
            ),
            this.valueProviderBasedOnIClass()
        )
    }

}
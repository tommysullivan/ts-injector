import {IDictionary} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-dictionary";
import {ValueProviderBasedOnInterface} from "./ValueProviderBasedOnInterface";
import {ValueProviderProxy} from "./ValueProviderProxy";
import {ValueProviderBasedOnIClass} from "./ValueProviderBasedOnIClass";
import {ValueProviderUsesFirstWorkableProvider} from "./ValueProviderUsesFirstWorkableProvider";
import {ICollections} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-collections";
import {ValueProviderUsingDictionaryWhereKeyIsArgumentName} from "./ValueProviderUsingDictionaryWhereKeyIsArgumentName";
import {ValueProviderUsesTypeOfArgument} from "./ValueProviderUsesTypeOfArgument";
import {
    IValueProviderBasedOnIClass, IValueProviderBasedOnInterface, IValueProviderBasedOnType
} from "../reflection/interfaces";

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

    valueProviderBasedOnIType<T>():IValueProviderBasedOnType<T> {
        return new ValueProviderUsesFirstWorkableProvider(
            this.collections.newList<IValueProviderBasedOnType<T>>([
                new ValueProviderProxy(
                    () => this.valueProviderBasedOnIClass<T>()
                ),
                this.valueProviderBasedOnInterface<T>()
            ])
        )
    }

    valueProviderBasedOnIClass<T>():IValueProviderBasedOnIClass<T> {
        return new ValueProviderBasedOnIClass<T>(
            new ValueProviderUsesFirstWorkableProvider(
                this.collections.newList([
                    new ValueProviderUsingDictionaryWhereKeyIsArgumentName(this.argumentNameToValueDictionaryProvider()),
                    new ValueProviderUsesTypeOfArgument(
                        this.valueProviderBasedOnIType<any>()
                    )
                    //TODO: Test whether a non argument type of provider would cause a compiler error (if not, a runtime?)
                ])
            )
        )
    }

    // valueProviderBasedOnClass<T>(reflectionDigest:IReflectionDigest):IValueProviderBasedOnClass<T> {
    //     return new ValueProviderBasedOnClass<T>(
    //         new Reflector(
    //             reflectionDigest
    //         ),
    //         this.valueProviderBasedOnIClass<T>()
    //     )
    // }

}
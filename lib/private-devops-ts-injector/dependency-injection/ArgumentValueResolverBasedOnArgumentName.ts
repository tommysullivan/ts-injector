import {IArgument, IValueProvider} from "../reflection/interfaces";
import {IDictionary} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-dictionary";

export class ValueProviderUsingDictionaryWhereKeyIsArgumentName<TTypeOfValueDesired> implements IValueProvider<IArgument<any>, TTypeOfValueDesired> {
    constructor(private readonly nameToValueDictionary:IDictionary<any>) {}

    provideValueBasedOn(arg: IArgument<any>): TTypeOfValueDesired {
        return this.nameToValueDictionary.get(arg.name);
    }

    canProvideValueBasedOn(arg: IArgument<TTypeOfValueDesired>): boolean {
        return this.nameToValueDictionary.hasKey(arg.name);
    }

    toString():string {
        return `ArgumentValueResolverBasedOnArgumentName { nameToValueDictionary: ${this.nameToValueDictionary} }`;
    }
}
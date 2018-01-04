import {IArgument, IDecisionCriteria, IType, IValueProvider} from "../reflection/interfaces";
import {IDictionary} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-dictionary";

export class ValueProviderUsingDictionaryWhereKeyIsArgumentName<TypeOfValueDesired extends IType<TypeOfValueDesired>> implements IValueProvider<IArgument<any>, TypeOfValueDesired> {
    constructor(private readonly nameToValueDictionary:IDictionary<any>) {}

    provideValueBasedOn(arg: IArgument<any>): TypeOfValueDesired {
        return this.nameToValueDictionary.get(arg.name);
    }

    canProvideValueBasedOn(decisionCriteria: IDecisionCriteria<TypeOfValueDesired>): boolean {
        return decisionCriteria.kind == 'IArgument'
            && this.nameToValueDictionary.hasKey(decisionCriteria.name);
    }

    toString():string {
        return `ArgumentValueResolverBasedOnArgumentName { defined argument names: ${this.nameToValueDictionary.keys} }`;
    }
}
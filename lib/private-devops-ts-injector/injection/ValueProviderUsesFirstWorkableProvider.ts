import {IList} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-list";
import {IDecisionCriteria, IValueProvider} from "../reflection/interfaces";
import {ErrorWithCause} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/errors/error-with-cause";

export class ValueProviderUsesFirstWorkableProvider<TDecisionCriteria extends IDecisionCriteria<TypeOfValueDesired>, TypeOfValueDesired> implements IValueProvider<TDecisionCriteria, TypeOfValueDesired>{
    constructor(
        private readonly valueProviders:IList<IValueProvider<TDecisionCriteria, TypeOfValueDesired>>
    ) {}

    provideValueBasedOn(decisionCriteria:TDecisionCriteria):TypeOfValueDesired {
        try {
            return this.valueProviders.firstWhere(r => r.canProvideValueBasedOn(decisionCriteria)).provideValueBasedOn(decisionCriteria);
        }
        catch(e) {
            const message = [
                `Attempted to resolve value using first of several IValueProviders, but encountered a problem.`,
                `decisionCriteria: ${decisionCriteria}`,
                `possible IValueProviders:`,
                ...this.valueProviders.map(r => r.toString()).toArray()
            ].join("\n");
            throw new ErrorWithCause(
                message,
                e
            );
        }
    }

    canProvideValueBasedOn(arg:TDecisionCriteria): boolean {
        return this.valueProviders.hasAtLeastOne(r => r.canProvideValueBasedOn(arg));
    }
}
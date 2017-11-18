import {IType, IValueProvider} from "../reflection/interfaces";

export class ValueProviderProxy<TDecisionCriteria extends IType<TypeOfValueDesired>, TypeOfValueDesired> implements IValueProvider<TDecisionCriteria, TypeOfValueDesired> {
    constructor(
        private readonly actualInjectorProvider:()=>IValueProvider<TDecisionCriteria, TypeOfValueDesired>
    ) {}

    provideValueBasedOn(decisionCriteria: TDecisionCriteria): TypeOfValueDesired {
        return this.actualInjectorProvider().provideValueBasedOn(decisionCriteria);
    }

    canProvideValueBasedOn(decisionCriteria: TDecisionCriteria): boolean {
        return this.actualInjectorProvider().canProvideValueBasedOn(decisionCriteria);
    }
}


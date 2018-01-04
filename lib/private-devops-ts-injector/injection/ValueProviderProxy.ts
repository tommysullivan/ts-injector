import {IDecisionCriteria, IValueProvider} from "../reflection/interfaces";

export class ValueProviderProxy<TDecisionCriteria extends IDecisionCriteria<TypeOfValueDesired>, TypeOfValueDesired>  implements IValueProvider<TDecisionCriteria, TypeOfValueDesired> {
    constructor(
        private readonly actualInjectorProvider:()=>IValueProvider<TDecisionCriteria, TypeOfValueDesired>
    ) {}

    provideValueBasedOn(decisionCriteria: TDecisionCriteria): TypeOfValueDesired {
        return this.actualInjectorProvider().provideValueBasedOn(decisionCriteria);
    }

    canProvideValueBasedOn(decisionCriteria: IDecisionCriteria<TypeOfValueDesired>): boolean {
        const result = this.actualInjectorProvider().canProvideValueBasedOn(decisionCriteria);
        // console.log(`ValueProviderProxy.canProvideValueBasedOn decisionCriteria=${decisionCriteria} result=${result}`);
        return result;
    }

    toString():string {
        return `ValueProviderProxy - proxies actual provider: ${this.actualInjectorProvider()}`;
    }
}

import {
    IArgument, IDecisionCriteria,
    IValueProviderBasedOnArgument, IValueProviderBasedOnType
} from "../reflection/interfaces";

export class ValueProviderUsesTypeOfArgument<TypeOfValueDesired> implements IValueProviderBasedOnArgument<TypeOfValueDesired> {

    constructor(
        private readonly valueProviderBasedOnType:IValueProviderBasedOnType<any>
    ) {}

    provideValueBasedOn(arg: IArgument<TypeOfValueDesired>): TypeOfValueDesired {
        return this.valueProviderBasedOnType.provideValueBasedOn(arg.type);
    }

    canProvideValueBasedOn(decisionCriteria:IDecisionCriteria<TypeOfValueDesired>):boolean {
        return decisionCriteria.kind == 'IArgument'
            && this.valueProviderBasedOnType.canProvideValueBasedOn(decisionCriteria.type);
    }

    toString():string {
        return `ValueProviderUsesTypeOfArgument - valueProviderBasedOnType: ${this.valueProviderBasedOnType}`;
    }
}
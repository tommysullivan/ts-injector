import {IArgument, IType, IValueProvider, IValueProviderBasedOnArgument} from "../reflection/interfaces";

export class ValueProviderUsesTypeOfArgument<TypeOfValueDesired> implements IValueProviderBasedOnArgument<TypeOfValueDesired> {

    constructor(
        private readonly valueProviderBasedOnType:IValueProvider<IType<TypeOfValueDesired>, TypeOfValueDesired>
    ) {}

    provideValueBasedOn(arg: IArgument<any>): TypeOfValueDesired {
        return this.valueProviderBasedOnType.provideValueBasedOn(arg.type);
    }

    canProvideValueBasedOn(arg: IArgument<any>): boolean {
        return this.valueProviderBasedOnType.canProvideValueBasedOn(arg.type);
    }
}
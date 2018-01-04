import {
    IValueProviderBasedOnInterface, IInterface,
    IValueProviderBasedOnIClass, IDecisionCriteria
} from "../reflection/interfaces";

export class ValueProviderBasedOnInterface<TypeOfValueDesired> implements IValueProviderBasedOnInterface<TypeOfValueDesired> {
    constructor(
        private readonly valueProviderBasedOnIClass:IValueProviderBasedOnIClass<TypeOfValueDesired>
    ) {}

    provideValueBasedOn(theInterface: IInterface<TypeOfValueDesired>):TypeOfValueDesired {
        const possibleImplementations = theInterface.implementations;
        if(possibleImplementations.hasMany) {
            throw new Error([
                `Tried to resolve value for interface type, but there were too many implementations without any rules how to choose the preferred one`,
                ...possibleImplementations.map(i => i.toString()).toArray()
            ].join("\n"));
        }
        if(possibleImplementations.isEmpty) {
            throw new Error([
                `Tried to resolve value for interface type, but no implementing classes were found`,
            ].join("\n"));
        }
        return this.valueProviderBasedOnIClass.provideValueBasedOn(possibleImplementations.first);
    }

    canProvideValueBasedOn(decisionCriteria:IDecisionCriteria<any>):boolean {
        return decisionCriteria.kind=='IInterface';
    }

    toString():string {
        return 'ValueProviderBasedOnInterface';
    }
}
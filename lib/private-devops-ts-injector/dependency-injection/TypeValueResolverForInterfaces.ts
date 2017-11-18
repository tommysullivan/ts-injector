import {
    IValueProviderBasedOnInterface, IInterface, IClass,
    IValueProviderBasedOnIClass
} from "../reflection/interfaces";

export class TypeValueResolverForInterfaces<TypeOfValueDesired> implements IValueProviderBasedOnInterface<TypeOfValueDesired> {
    constructor(
        private readonly valueProviderBasedOnClass:IValueProviderBasedOnIClass<TypeOfValueDesired>
    ) {}

    provideValueBasedOn(theType: IInterface<TypeOfValueDesired>):TypeOfValueDesired {
        const possibleImplementations = theType.asInterface.implementations;
        if(possibleImplementations.hasMany) {
            throw new Error([
                `Tried to resolve value for interface type, but there were too many implementations`,
                ...possibleImplementations.map(i => i.toString()).toArray()
            ].join("\n"));
        }
        if(possibleImplementations.isEmpty) {
            throw new Error([
                `Tried to resolve value for interface type, but no implementing classes were found`,
            ].join("\n"));
        }
        return this.valueProviderBasedOnClass.provideValueBasedOn(possibleImplementations.first);
    }

    canProvideValueBasedOn(theType:  IInterface<TypeOfValueDesired>): boolean {
        return theType.isInterface;
    }

    toString():string {
        return 'TypeValueResolverForInterfaces';
    }
}
import {IClass, IValueProviderBasedOnArgument, IValueProviderBasedOnIClass} from "../reflection/interfaces";
import {ErrorWithCause} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/errors/error-with-cause";

export class ValueProviderBasedOnIClass<TypeOfValueDesired> implements IValueProviderBasedOnIClass<TypeOfValueDesired> {
    constructor(private readonly argumentValueResolver:IValueProviderBasedOnArgument<any>) {}

    provideValueBasedOn(theType: IClass<TypeOfValueDesired>):TypeOfValueDesired {
        const theClass = theType.asClass;
        try {
            const theConstructor = theClass.theConstructor;
            const constructorParameters = theConstructor.args.map(
                arg => this.argumentValueResolver.provideValueBasedOn(arg)
            );
            return theConstructor.invoke(constructorParameters.toArray());
        }
        catch(e) {
            throw new ErrorWithCause(
                [
                    `Tried to create class instance using an IClass, but encountered a problem`,
                    `IClass: ${theClass}`
                ].join("\n"),
                e
            );
        }
    }

    canProvideValueBasedOn(theType: IClass<TypeOfValueDesired>): boolean {
        return theType.isClass;
    }

    toString():string {
        return 'ValueProviderBasedOnIClass';
    }
}
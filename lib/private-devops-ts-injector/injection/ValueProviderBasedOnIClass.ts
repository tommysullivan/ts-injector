import {
    IClass, IDecisionCriteria, IValueProviderBasedOnArgument,
    IValueProviderBasedOnIClass
} from "../reflection/interfaces";
import {ErrorWithCause} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/errors/error-with-cause";

export class ValueProviderBasedOnIClass<TypeOfValueDesired> implements IValueProviderBasedOnIClass<TypeOfValueDesired> {
    constructor(private readonly argumentValueResolver:IValueProviderBasedOnArgument<any>) {}

    provideValueBasedOn(theClass:IClass<TypeOfValueDesired>):TypeOfValueDesired {
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

    canProvideValueBasedOn(decisionCriteria:IDecisionCriteria<any>):boolean {
        const result = decisionCriteria.kind == 'IClass';
        // console.log(`ValueProviderBasedOnIClass.canProvideValueBasedOn decisionCriteria=${decisionCriteria} decisionCriteria.kind=${decisionCriteria.kind} result=${result}`);
        return result;
    }

    toString():string {
        return 'ValueProviderBasedOnIClass';
    }
}
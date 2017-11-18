import {IList} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-list";
import {IArgument, IValueProviderBasedOnArgument} from "../reflection/interfaces";
import {ErrorWithCause} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/errors/error-with-cause";

export class ArgumentValueResolverMultiplexer<TypeOfValueDesired> implements IValueProviderBasedOnArgument<TypeOfValueDesired> {
    constructor(
        private readonly argumentValueResolvers:IList<IValueProviderBasedOnArgument<TypeOfValueDesired>>
    ) {}

    provideValueBasedOn(arg: IArgument<any>):TypeOfValueDesired {
        try {
            return this.argumentValueResolvers.firstWhere(r => r.canProvideValueBasedOn(arg)).provideValueBasedOn(arg);
        }
        catch(e) {
            const message = [
                `Attempted to resolve argument value using first of several resolvers, but encountered a problem.`,
                `Argument: ${arg}`,
                `Resolvers:`,
                ...this.argumentValueResolvers.map(r => r.toString()).toArray()
            ].join("\n");
            throw new ErrorWithCause(
                message,
                e
            );
        }
    }

    canProvideValueBasedOn(arg: IArgument<any>): boolean {
        return this.argumentValueResolvers.hasAtLeastOne(r => r.canProvideValueBasedOn(arg));
    }
}
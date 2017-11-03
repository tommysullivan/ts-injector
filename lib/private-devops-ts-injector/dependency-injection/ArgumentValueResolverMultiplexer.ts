import {IArgumentValueResolver} from "./Injector";
import {IList} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-list";
import {IArgument} from "../reflection/interfaces";
import {ErrorWithCause} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/errors/error-with-cause";

export class ArgumentValueResolverMultiplexer implements IArgumentValueResolver {
    constructor(private readonly argumentValueResolvers:IList<IArgumentValueResolver>) {}

    resolveArgumentValue(arg: IArgument): any {
        try {
            return this.argumentValueResolvers.firstWhere(r => r.canResolveArgumentValue(arg)).resolveArgumentValue(arg);
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

    canResolveArgumentValue(arg: IArgument): boolean {
        return this.argumentValueResolvers.hasAtLeastOne(r => r.canResolveArgumentValue(arg));
    }
}
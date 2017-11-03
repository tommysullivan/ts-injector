import {IArgumentValueResolver} from "./Injector";
import {IArgument} from "../reflection/interfaces";
import {IDictionary} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-dictionary";

export class ArgumentValueResolverBasedOnArgumentName implements IArgumentValueResolver {
    constructor(private readonly nameToValueDictionary:IDictionary<any>) {}

    resolveArgumentValue(arg: IArgument): any {
        return this.nameToValueDictionary.get(arg.name);
    }

    canResolveArgumentValue(arg: IArgument): boolean {
        return this.nameToValueDictionary.hasKey(arg.name);
    }

    toString():string {
        return `ArgumentValueResolverBasedOnArgumentName { nameToValueDictionary: ${this.nameToValueDictionary} }`;
    }
}
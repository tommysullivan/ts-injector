import {IArgumentValueResolver, IInjector} from "./Injector";
import {IArgument, IReflector} from "../reflection/interfaces";

export class ArgumentValueResolverForInterfaces implements IArgumentValueResolver {
    constructor(
        private readonly reflector:IReflector,
        private readonly injector:IInjector
    ) {}

    canResolveArgumentValue(arg: IArgument): boolean {
        return arg.type.isInterface;
    }

    resolveArgumentValue(arg: IArgument): any {
        const possibleImplementations = this.reflector.interface(arg.type).implementations;
        if(possibleImplementations.hasMany) {
            throw new Error([
                `Tried to resolve argument for interface type, but there were too many implementations`,
                `Argument: ${arg}`,
                ...possibleImplementations.map(i => i.toString()).toArray()
            ].join("\n"));
        }
        if(possibleImplementations.isEmpty) {
            throw new Error([
                `Tried to resolve argument for interface type, but no implementing classes were found`,
                `Argument: ${arg}`
            ].join("\n"));
        }
        return this.injector.createInstanceFromIClass(possibleImplementations.first);
    }

    toString():string {
        return 'ArgumentValueResolverForInterfaces';
    }
}
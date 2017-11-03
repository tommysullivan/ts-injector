import {IArgumentValueResolver, IInjector} from "./Injector";
import {IArgument} from "../reflection/interfaces";

export class ArgumentValueResolverForClass implements IArgumentValueResolver {
    constructor(private readonly injector:IInjector) {}

    resolveArgumentValue(arg: IArgument): any {
        return this.injector.createInstanceOf(arg.type.nativeTypeReference);
    }

    canResolveArgumentValue(arg: IArgument): boolean {
        return arg.type.isClass;
    }

    toString():string {
        return 'ArgumentValueResolverForClass';
    }
}
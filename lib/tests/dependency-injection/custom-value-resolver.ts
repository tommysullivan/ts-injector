import {ICustomValueResolver, IInjector} from "../../private-devops-ts-injector/dependency-injection/injector";
import {IArgument, IReflector, IType} from "../../private-devops-ts-injector/reflection/interfaces";

export class CustomValueResolver implements ICustomValueResolver {
    constructor(private readonly reflector:IReflector) {}

    // TODO: Elegant custom factory methods with dependency injected params
    // createConsole(nativeConsole:any, readLineSyncModule:any):Console {
    //     return new Console(nativeConsole, readLineSyncModule, 'INFO');
    // }

    instanceForType(type: IType, injector:IInjector):any {
        if(type.name=='IInjector') return injector;
    }

    resolveArgumentValue(arg: IArgument): any {
        // if(arg.type.name=='number') return 7;
    }

    instanceForTypeWhenAutomaticConstructionFails(type: IType): any {}
}
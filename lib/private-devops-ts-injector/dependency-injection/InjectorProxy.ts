import {IInjector} from "./Injector";
import {IClass, NativeClassReference} from "../reflection/interfaces";

export class InjectorProxy implements IInjector {
    constructor(private readonly actualInjectorProvider:()=>IInjector) {}

    createInstanceOf<ClassToInstantiate>(theClass: NativeClassReference<ClassToInstantiate>): ClassToInstantiate {
        return this.actualInjectorProvider().createInstanceOf(theClass);
    }

    createInstanceFromIClass<ClassToInstantiate>(theClass: IClass<ClassToInstantiate>): ClassToInstantiate {
        return this.actualInjectorProvider().createInstanceFromIClass(theClass);
    }
}
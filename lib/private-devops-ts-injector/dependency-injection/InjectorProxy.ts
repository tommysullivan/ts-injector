// import {IInjector, IClass, NativeClassReference} from "../reflection/interfaces";
// import {NotImplementedError} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/errors/not-implemented-error";
//
// export class InjectorProxy implements IInjector {
//     constructor(private readonly actualInjectorProvider:()=>IInjector) {}
//
//     createInstanceOf<ClassToInstantiate>(theClass: NativeClassReference<ClassToInstantiate>): ClassToInstantiate {
//         return this.actualInjectorProvider().createInstanceOf(theClass);
//     }
//
//     createInstanceFromIType<T>(theClass: IClass<T>): T {
//         throw new NotImplementedError();
//     }
// }
// import {ErrorWithCause} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/errors/error-with-cause";
// import {
//     IReflector, IValueProviderBasedOnIClass,
//     NativeClassReference, IValueProviderBasedOnClass, IType, IDecisionCriteria
// } from "../reflection/interfaces";
//
// export class ValueProviderBasedOnClass<TypeOfValueDesired> implements IValueProviderBasedOnClass<TypeOfValueDesired> {
//     constructor(
//         private readonly reflector:IReflector,
//         private readonly valueProviderBasedOnIClass:IValueProviderBasedOnIClass<TypeOfValueDesired>
//     ) {}
//
//     provideValueBasedOn(nativeClassReference: NativeClassReference<TypeOfValueDesired>): TypeOfValueDesired {
//         try {
//             return this.valueProviderBasedOnIClass.provideValueBasedOn(this.reflector.classOf(nativeClassReference));
//         }
//         catch(e) {
//             throw new ErrorWithCause(
//                 [
//                     `Tried to create class instance for a native class reference, but encountered a problem`,
//                     `nativeClassReference: ${nativeClassReference.name}`
//                 ].join("\n"),
//                 e
//             );
//         }
//     }
//
//     canProvideValueBasedOn(possibleNativeClassReference: IDecisionCriteria): boolean {
//         return possibleNativeClassReference.kind == 'IArgument' &&
//             this.valueProviderBasedOnIClass.canProvideValueBasedOn(t)
//         // if(possibleNativeClassReference.kind == 'IArgument') {
//         //     possibleNativeClassReference.
//         // }
//         // return this.valueProviderBasedOnIClass.canProvideValueBasedOn(this.reflector.classOf(nativeClassReference));
//     }
// }
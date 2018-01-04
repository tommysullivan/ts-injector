// import {IFunctionSignature, IInterface, IClass, IConstructor} from "./interfaces";
//
// export class Primitive<T> implements IClass<T> {
//     constructor(
//         public readonly nativeTypeReference:Function,
//         public readonly theConstructor:IConstructor<T>
//     ) {}
//
//     isNonFunctionPrimitive: boolean = true;
//     isClass: boolean = false;
//     isInterface: boolean = false;
//     isFunction = false;
//
//     get name():string {
//         return this.nativeTypeReference.name
//     }
//
//     get asClass():IClass<T> {
//         throw new TypeError(`Tried to represent a primitive type as a class. Primitive Type: ${this}`);
//     }
//
//     get asInterface():IInterface<T> {
//         throw new TypeError(`Tried to represent a primitive type as an interface. Primitive Type: ${this}`);
//     }
//
//     get asFunctionSignature():IFunctionSignature<T> {
//         throw new TypeError(`Tried to represent a primitive type as a function signature type. Primitive type: ${this}`);
//     }
//
//     toString():string {
//         return `Primitive Type { name: ${this.name} }`;
//     }
// }
import {IType} from "./interfaces";

export class Primitive implements IType {
    constructor(public readonly nativeTypeReference:Function) {}

    isPrimitive: boolean = true;
    isClass: boolean = false;
    isInterface: boolean = false;

    get name():string {
        return this.nativeTypeReference.name
    }
}
import {
    IClass, IReflectionDigest, IInterface,
    IReflector, IType,
    NativeClassReference
} from "./interfaces";
import {ErrorWithCause} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/errors/error-with-cause";

export class Reflector implements IReflector {

    constructor(
        private readonly reflectionDigest:IReflectionDigest
    ) {}

    classOf<T>(nativeClassReference: NativeClassReference<T>): IClass<T> {
        try {
            return this.reflectionDigest.classes.firstWhere(c => c.name == nativeClassReference.name);
        }
        catch(e) {
            throw new ErrorWithCause(
                [
                    `Reflector could not find class for the sought NativeClassReference`,
                    `NativeClassReference: ${nativeClassReference.name}`
                ].join("\n"),
                e
            );
        }
    }

    interface<T>(interfaceType: IType): IInterface<T> {
        try {
            if(!interfaceType.isInterface) throw new Error(`Attempted to look up interface using IType for which isInterface returned false`);
            return this.reflectionDigest.interfaces.firstWhere(i => i.name == interfaceType.name);
        }
        catch(e) {
            throw new ErrorWithCause(
                [
                    `Reflector could not find interface for the sought IType`,
                    `IType: ${interfaceType}`
                ].join("\n"),
                e
            );
        }
    }
}
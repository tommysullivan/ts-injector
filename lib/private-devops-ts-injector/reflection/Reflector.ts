import {
    IReflectionDigest, IInterface,
    IReflector, IClass,
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

    interfaceOf<T>(interfaceType: IInterface<T>): IInterface<T> {
        try {
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
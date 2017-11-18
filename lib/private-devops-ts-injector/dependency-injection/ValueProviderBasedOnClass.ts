import {ErrorWithCause} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/errors/error-with-cause";
import {
    IReflector, IValueProviderBasedOnIClass,
    NativeClassReference, IValueProvider
} from "../reflection/interfaces";

export class ValueProviderBasedOnClass<TypeOfValueDesired> implements IValueProvider<NativeClassReference<TypeOfValueDesired>, TypeOfValueDesired> {
    constructor(
        private readonly reflector:IReflector,
        private readonly valueProviderBasedOnIClass:IValueProviderBasedOnIClass<TypeOfValueDesired>
    ) {}

    provideValueBasedOn(nativeClassReference: NativeClassReference<TypeOfValueDesired>): TypeOfValueDesired {
        try {
            return this.valueProviderBasedOnIClass.provideValueBasedOn(this.reflector.classOf(nativeClassReference));
        }
        catch(e) {
            throw new ErrorWithCause(
                [
                    `Tried to create class instance for a native class reference, but encountered a problem`,
                    `nativeClassReference: ${nativeClassReference.name}`
                ].join("\n"),
                e
            );
        }
    }

    canProvideValueBasedOn(nativeClassReference: NativeClassReference<TypeOfValueDesired>): boolean {
        return this.valueProviderBasedOnIClass.canProvideValueBasedOn(this.reflector.classOf(nativeClassReference));
    }
}
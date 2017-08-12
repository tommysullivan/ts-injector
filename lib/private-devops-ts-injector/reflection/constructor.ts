import {Argument} from "./argument";
import {IArgument, IArgumentMetadata, IConstructor, IReflector, NativeClassReference} from "./interfaces";

export class Constructor<T> implements IConstructor<T> {
    constructor(
        private readonly theClass: NativeClassReference<T>,
        private readonly constructorArgs:IArgumentMetadata[],
        private readonly reflector:IReflector
    ) {}

    invoke(args: any[]): T {
        return new this.theClass(...args);
    }

    get args(): IArgument[] {
        return this.constructorArgs.map((argMD, index) => new Argument(argMD, this.reflector, index));
    }
}
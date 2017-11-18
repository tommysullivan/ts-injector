import {IArgument, IConstructor, NativeClassReference} from "./interfaces";
import {IList} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-list";
import {ErrorWithCause} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/errors/error-with-cause";

export class Constructor<T> implements IConstructor<T> {
    constructor(
        public readonly args:IList<IArgument<any>>,
        private readonly actualConstructor:NativeClassReference<T>
    ) {}

    invoke(args: any[]): T {
        try {
            const requiredArgs = this.args.where(a => !a.isOptional);
            if(args.length < requiredArgs.length) {
                throw new Error([
                    `Attempted to pass fewer args than the constructor requires`,
                    `Required:`,
                    ...requiredArgs.toArray(),
                    ``
                ].join("\n"));
            }
            return new this.actualConstructor(...args);
        }
        catch(e) {
            throw new ErrorWithCause(
                [
                    `Tried to invoke constructor but encountered a problem`,
                    `actualConstructor: ${this.actualConstructor.name}`,
                    `args:`,
                    ...(args || [`[No arguments were passed]`])
                ].join("\n"),
                e
            )
        }
    }
}
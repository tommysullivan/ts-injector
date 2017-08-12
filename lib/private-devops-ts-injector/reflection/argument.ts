import {IArgument, IArgumentMetadata, IReflector, IType} from "./interfaces";
import {Type} from "./type";

export class Argument implements IArgument {
    constructor(
        private readonly argMetadata:IArgumentMetadata,
        private readonly reflector:IReflector,
        public readonly index:number
    ) {}

    get type(): IType {
        return new Type(
            this.argMetadata.typeName,
            this.reflector
        )
    }

    get name():string {
        return this.argMetadata.name;
    }

    get position():number {
        return this.index + 1;
    }

    toString():string {
        return `Argument ${this.position}, "${this.name}" (of type ${this.type.name})`;
    }
}
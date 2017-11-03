import {IArgument, IType} from "./interfaces";

export class Argument implements IArgument {
    constructor(
        public readonly name:string,
        public readonly index:number,
        public readonly type:IType,
        public readonly isOptional:boolean
    ) {}

    get position():number { return this.index + 1; }

    toString():string {
        return `Argument { position: ${this.position}, name: "${this.name}", type: ${this.type.name} }`;
    }
}
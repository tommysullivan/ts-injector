import {IClass, IInterface} from "./interfaces";
import {IList} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-list";

export class Interface<T> implements IInterface<T> {
    constructor(
        public readonly name:string,
        public readonly implementations: IList<IClass<T>>
    ) {}

    isPrimitive: boolean = false;
    isClass: boolean = false;
    isInterface: boolean = true;

    get nativeTypeReference():any {
        throw new Error([
            `Cannot get nativeTypeReference for interface since javascript runtime has no concept of interface`,
            `name: ${this.name}`
        ].join("\n"));
    }

    toString():string {
        return `Interface { name: ${this.name} }`;
    }
}
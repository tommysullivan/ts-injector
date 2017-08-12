import {IReflector, IType} from "./interfaces";

export class Type implements IType {
    constructor(
        public readonly name:string,
        private readonly reflector:IReflector
    ) {}

    private readonly primitiveTypeNames = [
        'boolean',
        'number',
        'string',
        'object',
        'array'
    ];

    get isPrimitive(): boolean {
        return this.primitiveTypeNames.indexOf(this.name) >= 0;
    }

    get nativeTypeReference(): any {
        return this.reflector.nativeClassWithName(this.name);
    }

    get isClass():boolean {
        return this.reflector.hasClassWithName(this.name);
    }
}
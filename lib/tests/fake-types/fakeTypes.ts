export class NoArgConstructorClass {}

export class ClassWhoseConstructorDependsOnNoArgConstructorClass {
    constructor(
        public readonly a:NoArgConstructorClass
    ) {}
}

export class MultiLevelClass {
    constructor(
        public readonly a:NoArgConstructorClass,
        public readonly b:ClassWhoseConstructorDependsOnNoArgConstructorClass,
        public readonly c:ClassWhoseConstructorDependsOnNoArgConstructorClass
    ) {}
}

export interface IPerson {
    firstName:string;
    lastName:string;
}

export interface IOther {
    myes:string;
}

export class PersonA implements IPerson {
    constructor(public a:number, public b:IOther) {}
    firstName ='tommy';
    lastName = 'sullivan';
}

export class PersonB implements IPerson {
    firstName = 'matt';
    lastName = 'Tastula';
}

export const nativeClassReferences = [
    NoArgConstructorClass,
    ClassWhoseConstructorDependsOnNoArgConstructorClass,
    MultiLevelClass
];
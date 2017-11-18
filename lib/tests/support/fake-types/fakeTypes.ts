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

export interface IDependencyInterface {
    a:NoArgConstructorClass;
}

export class InterfaceImplementor implements IDependencyInterface {
    constructor(public readonly a:NoArgConstructorClass) {}
}

export class ClassWhoseConstructorTakesAnInterfaceParameter {
    constructor(
        public readonly a:IDependencyInterface
    ) {}
}

export class ClassThatNeedsFactory {
    constructor(
        public readonly newDependencyInterface:()=>IDependencyInterface
    ) {}

    get noArgConstructorClassInstance():NoArgConstructorClass {
        return this.newDependencyInterface().a;
    }
}
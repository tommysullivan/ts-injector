export class NoArgConstructorClass {
    isNoArgConstructorClass = true;
}

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
    d:NoArgConstructorClass;
}

export class InterfaceImplementor implements IDependencyInterface {
    constructor(public readonly d:NoArgConstructorClass) {}
}

export class ClassWhoseConstructorTakesAnInterfaceParameter {
    constructor(
        public readonly a:IDependencyInterface
    ) {}
}

//works for above

export class ClassWhoseConstructorRequiresFactoryThatWhenCalledAfterConstructionHasCompeltedYieldsIDependencyInterface {
    constructor(
        public readonly newDependencyInterface:()=>IDependencyInterface
    ) {}

    get noArgConstructorClassInstance():NoArgConstructorClass {
        return this.newDependencyInterface().d;
    }
}
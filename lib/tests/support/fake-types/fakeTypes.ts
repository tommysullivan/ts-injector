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

export class ClassWhoseConstructorRequiresFactoryThatWhenCalledAfterConstructionHasCompeltedYieldsIDependencyInterface {
    constructor(
        public readonly newDependencyInterfsssace:()=>IDependencyInterface
    ) {}

    get noArgConstructorClassInstance():NoArgConstructorClass {
        return this.newDependencyInterfsssace().d;
    }
}
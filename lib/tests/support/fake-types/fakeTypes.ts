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

export class ClassWithInterfaceParameter {
    constructor(
        public readonly a:IDependencyInterface
    ) {}
}
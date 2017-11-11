import {
    IArgument,
    IClass, IInterface, IReflectionDigest, IType, NativeClassReference
} from "../../../private-devops-ts-injector/reflection/interfaces";
import {IList} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-list";
import {Class} from "../../../private-devops-ts-injector/reflection/Class";
import {
    ClassWhoseConstructorDependsOnNoArgConstructorClass, ClassWithInterfaceParameter, IDependencyInterface,
    InterfaceImplementor,
    MultiLevelClass,
    NoArgConstructorClass
} from "./fakeTypes";
import {Constructor} from "../../../private-devops-ts-injector/reflection/Constructor";
import {Argument} from "../../../private-devops-ts-injector/reflection/Argument";
import {Interface} from "../../../private-devops-ts-injector/reflection/Interface";
import {ICollections} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-collections";

interface IArgDescriptor {
    name:string,
    type:IType,
    isOptional?:boolean
}

export class ReflectionDigestForTesting implements IReflectionDigest {
    constructor(private readonly collections:ICollections) {}

    private newArguments(argDescriptors:IArgDescriptor[]):IArgument[] {
        return argDescriptors.map(
            (argDescriptor, index) => new Argument(
                argDescriptor.name,
                index,
                argDescriptor.type,
                argDescriptor.isOptional || false
            )
        );
    }

    private newClass(nativeClassReference:NativeClassReference<any>, args:IArgument[]) {
        return new Class(
            new Constructor(this.collections.newList(args), nativeClassReference),
            nativeClassReference
        );
    }

    get NoArgConstructorClass():IClass<NoArgConstructorClass> {
        return this.newClass(NoArgConstructorClass, []);
    }

    get ClassWhoseConstructorDependsOnNoArgConstructorClass():IClass<ClassWhoseConstructorDependsOnNoArgConstructorClass> {
        return this.newClass(
            ClassWhoseConstructorDependsOnNoArgConstructorClass,
            this.newArguments([
                {name: 'a', type: this.NoArgConstructorClass }
            ])
        );
    }

    get MultiLevelClass():IClass<MultiLevelClass> {
        return this.newClass(
            MultiLevelClass,
            this.newArguments([
                {name: 'a', type: this.NoArgConstructorClass },
                {name: 'b', type: this.ClassWhoseConstructorDependsOnNoArgConstructorClass },
                {name: 'c', type: this.ClassWhoseConstructorDependsOnNoArgConstructorClass }
            ])
        );
    }

    get ClassWithInterfaceParameter():IClass<ClassWithInterfaceParameter> {
        return this.newClass(
            ClassWithInterfaceParameter,
            this.newArguments([
                {name: 'a', type: this.IDependencyInterface }
            ])
        );
    }

    get InterfaceImplementor():IClass<InterfaceImplementor> {
        return this.newClass(
            InterfaceImplementor,
            this.newArguments([
                {name: 'a', type: this.NoArgConstructorClass }
            ])
        );
    }

    get IDependencyInterface():IInterface<IDependencyInterface> {
        return new Interface(
            'IDependencyInterface',
            this.collections.newList([
                this.InterfaceImplementor
            ])
        );
    }

    get classes(): IList<IClass<any>> {
        return this.collections.newList([
            this.NoArgConstructorClass,
            this.ClassWhoseConstructorDependsOnNoArgConstructorClass,
            this.MultiLevelClass,
            this.ClassWithInterfaceParameter
        ]);
    }

    get interfaces():IList<IInterface<any>> {
        return this.collections.newList([
            this.IDependencyInterface
        ]);
    }
}
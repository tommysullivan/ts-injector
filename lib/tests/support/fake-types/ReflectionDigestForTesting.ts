import {
    IArgument,
    IFunctionSignature, IInterface, IReflectionDigest, IClass, NativeClassReference, IType
} from "../../../private-devops-ts-injector/reflection/interfaces";
import {IList} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-list";
import {Class} from "../../../private-devops-ts-injector/reflection/Class";
import {
    ClassWhoseConstructorRequiresFactoryThatWhenCalledAfterConstructionHasCompeltedYieldsIDependencyInterface,
    ClassWhoseConstructorDependsOnNoArgConstructorClass, ClassWhoseConstructorTakesAnInterfaceParameter, IDependencyInterface,
    InterfaceImplementor,
    MultiLevelClass,
    NoArgConstructorClass
} from "./fakeTypes";
import {Constructor} from "../../../private-devops-ts-injector/reflection/Constructor";
import {Argument} from "../../../private-devops-ts-injector/reflection/Argument";
import {Interface} from "../../../private-devops-ts-injector/reflection/Interface";
import {ICollections} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-collections";
import {FunctionSignature} from "../../../private-devops-ts-injector/reflection/FunctionSignature";

interface IArgDescriptor<T> {
    name:string,
    type:IType<T>,
    isOptional?:boolean
}

export class ReflectionDigestForTesting implements IReflectionDigest {
    constructor(private readonly collections:ICollections) {}

    private newArguments(argDescriptors:IArgDescriptor<any>[]):IArgument<any>[] {
        return argDescriptors.map(
            (argDescriptor, index) => new Argument(
                argDescriptor.name,
                index,
                argDescriptor.type,
                argDescriptor.isOptional || false
            )
        );
    }

    private newClass<T>(nativeClassReference:NativeClassReference<T>, args:IArgument<any>[]):IClass<T> {
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

    get ClassWithInterfaceParameter():IClass<ClassWhoseConstructorTakesAnInterfaceParameter> {
        return this.newClass(
            ClassWhoseConstructorTakesAnInterfaceParameter,
            this.newArguments([
                {name: 'a', type: this.IDependencyInterface }
            ])
        );
    }

    get InterfaceImplementor():IClass<InterfaceImplementor> {
        return this.newClass(
            InterfaceImplementor,
            this.newArguments([
                {name: 'd', type: this.NoArgConstructorClass }
            ])
        );
    }

    get ClassThatNeedsFactory():IClass<ClassWhoseConstructorRequiresFactoryThatWhenCalledAfterConstructionHasCompeltedYieldsIDependencyInterface> {
        return this.newClass(
            ClassWhoseConstructorRequiresFactoryThatWhenCalledAfterConstructionHasCompeltedYieldsIDependencyInterface,
            this.newArguments([
                {
                    name: 'newDependencyInterface',
                    type: this.newDependencyInterface
                }
            ])
        );
    }

    get newDependencyInterface():IFunctionSignature<IDependencyInterface> {
        return new FunctionSignature(this.collections.newEmptyList<IArgument<any>>(), this.IDependencyInterface);
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
            this.ClassWithInterfaceParameter,
            this.ClassThatNeedsFactory,
            this.InterfaceImplementor
        ]);
    }

    get interfaces():IList<IInterface<any>> {
        return this.collections.newList([
            this.IDependencyInterface
        ]);
    }

    get functionSignatures():IList<IFunctionSignature<any>> {
        return this.collections.newList([
            this.newDependencyInterface
        ]);
    }
}
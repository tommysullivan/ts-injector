import {
    IArgument,
    IClass, IInterface, IReflectionDigest, IType, NativeClassReference
} from "../../../private-devops-ts-injector/reflection/interfaces";
import {IList} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/collections/i-list";
import {collections} from "../shared-lets";
import {Class} from "../../../private-devops-ts-injector/reflection/Class";
import {ClassWhoseConstructorDependsOnNoArgConstructorClass, MultiLevelClass, NoArgConstructorClass} from "./fakeTypes";
import {Constructor} from "../../../private-devops-ts-injector/reflection/Constructor";
import {Argument} from "../../../private-devops-ts-injector/reflection/Argument";

interface IArgDescriptor {
    name:string,
    type:IType,
    isOptional?:boolean
}

export class ReflectionDigestForTesting implements IReflectionDigest {
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
            new Constructor(collections().newList(args), nativeClassReference),
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

    classes: IList<IClass<any>> = collections().newList([
        this.NoArgConstructorClass,
        this.ClassWhoseConstructorDependsOnNoArgConstructorClass,
        this.MultiLevelClass
    ]);

    interfaces: IList<IInterface<any>> = collections().newList([

    ]);
}
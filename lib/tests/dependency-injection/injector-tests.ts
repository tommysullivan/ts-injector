import "../support/prepare-test-environment";
import {expect} from "chai";
import {Let} from "mocha-let-ts";
import {NotImplementedError} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/errors/not-implemented-error";
import {
    ICustomValueResolver, IInjector,
    Injector
} from "../../private-devops-ts-injector/dependency-injection/injector";
import {Reflector} from "../../private-devops-ts-injector/reflection/reflector";
import {Class} from "../../private-devops-ts-injector/reflection/class";
import {CustomValueResolver} from "./custom-value-resolver";
import {typeMetadataFakedForTestPurposes} from "../fake-types/fakeTypeMetadata";

import {
    ClassWhoseConstructorDependsOnNoArgConstructorClass, MultiLevelClass,
    NoArgConstructorClass, PersonA
} from "../fake-types/fakeTypes";
import {IArgument, IType, NativeClassReference} from "../../private-devops-ts-injector/reflection/interfaces";

describe('injector', () => {
    const customValueResolver = Let<ICustomValueResolver>(() => new CustomValueResolver(reflector()));
    const nativeClassReferences = Let<NativeClassReference<any>[]>(() => {
        throw new Error('no native class references defined for test case!')
    });
    const reflector = Let(() => new Reflector(typeMetadataFakedForTestPurposes, nativeClassReferences()));
    const injector = Let(() => new Injector(reflector(), customValueResolver()));

    describe('constructor', () => {
        nativeClassReferences(() => []);
        it('returns an instance', () => expect(injector()).to.be.an.instanceof(Injector));
    });

    describe("createInstanceOf<ClassToInstantiate>(theClass: NativeClassReference<ClassToInstantiate>)", () => {

        const theClass = Let<any>(() => { throw new NotImplementedError() });
        const instanceCreationResult = Let(() => injector().createInstanceOf(theClass()));

        const classesToTestForSimpleInstantiation = [
            NoArgConstructorClass,
            ClassWhoseConstructorDependsOnNoArgConstructorClass,
            MultiLevelClass
        ];

        nativeClassReferences(() => classesToTestForSimpleInstantiation);

        function expectClassToBeInstantiable() {
            it('returns a new instance', () => {
                expect(instanceCreationResult()).to.be.an.instanceof(theClass());
            });
        }

        classesToTestForSimpleInstantiation.forEach(classToInstantiate => {
            const classUnderTest = new Class(classToInstantiate, typeMetadataFakedForTestPurposes, new Reflector(typeMetadataFakedForTestPurposes, classesToTestForSimpleInstantiation));
            context(`when classUnderTest is class named "${classUnderTest.name}"`, () => {
                theClass(() => classToInstantiate);
                expectClassToBeInstantiable();
            });
        });

        context('MultiLevelClass', () => {
            theClass(() => MultiLevelClass);
            it('has properties a, b, and c each with their respective, distinct instances of correct type', () => {
                const instance = instanceCreationResult() as MultiLevelClass;
                expect(instance).to.have.property('a').that.is.instanceOf(NoArgConstructorClass);
                expect(instance).to.have.property('b').that.is.instanceOf(ClassWhoseConstructorDependsOnNoArgConstructorClass);
                expect(instance).to.have.property('c').that.is.instanceOf(ClassWhoseConstructorDependsOnNoArgConstructorClass);
                expect(instance.b).to.have.property('a').that.is.instanceOf(NoArgConstructorClass);
                expect(instance.c).to.have.property('a').that.is.instanceOf(NoArgConstructorClass);
                expect(instance.b).to.not.equal(instance.c);
                expect(instance.c.a).to.not.equal(instance.b.a);
            });
        });

        context('PersonA', () => {
            theClass(() => PersonA);
            nativeClassReferences(() => [PersonA]);

            context('when I have not specifically configured any injected values for type number', () => {
                it('throws an error', () => {
                    expect(() => instanceCreationResult()).to.throw();
                });
            });

            context('when I have specifically configured some injected values for type number', () => {
                customValueResolver(() => {
                    class ProviderOfNumberExtends extends CustomValueResolver {
                        resolveArgumentValue(arg: IArgument): any {
                            if(arg.type.name=='number') return 7;
                        }
                    }
                    return new ProviderOfNumberExtends(reflector());
                });

                expectClassToBeInstantiable();

                it('has property a with a numeric value', () => {
                    const instance = instanceCreationResult() as PersonA;
                    expect(instance.a).to.equal(7);
                });
            });
        })
    });
});
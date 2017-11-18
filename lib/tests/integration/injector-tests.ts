import "../support/prepare-test-environment";
import {expect} from "chai";
import {Let} from "mocha-let-ts";
import {
    ClassThatNeedsFactory,
    ClassWhoseConstructorDependsOnNoArgConstructorClass, ClassWhoseConstructorTakesAnInterfaceParameter, InterfaceImplementor,
    MultiLevelClass,
    NoArgConstructorClass
} from "../support/fake-types/fakeTypes";
import {collections, valueProviderBasedOnClass} from "../support/shared-lets";
import {ReflectionDigestForTesting} from "../support/fake-types/ReflectionDigestForTesting";
import {ValueProviderBasedOnIClass} from "../../private-devops-ts-injector/dependency-injection/ValueProviderBasedOnIClass";
import {NativeClassReference} from "../../private-devops-ts-injector/reflection/interfaces";
import {ValueProviderBasedOnClass} from "../../private-devops-ts-injector/dependency-injection/ValueProviderBasedOnClass";

const xcontext = xdescribe;

describe('ValueProviderBasedOnIClass', () => {
    it('is instantiable', () => expect(valueProviderBasedOnClass()).to.be.an.instanceof(ValueProviderBasedOnClass));

    describe("createInstanceOf<ClassToInstantiate>(theClass: NativeClassReference<ClassToInstantiate>)", () => {

        const theClass = Let<NativeClassReference<any>>();
        const instanceCreationResult = Let(() => valueProviderBasedOnClass().provideValueBasedOn(theClass()));

        function expectClassToBeInstantiable() {
            it('returns a new instance', () => {
                expect(instanceCreationResult()).to.be.an.instanceof(theClass());
            });
        }

        context(NoArgConstructorClass.name, () => {
            theClass(() => NoArgConstructorClass);
            expectClassToBeInstantiable();
        });

        context(ClassWhoseConstructorDependsOnNoArgConstructorClass.name, () => {
            theClass(() => ClassWhoseConstructorDependsOnNoArgConstructorClass);
            expectClassToBeInstantiable();
            it('has member a of type NoArgConstructoClass', () => {
                const typedInstanceCreationResult = instanceCreationResult() as ClassWhoseConstructorDependsOnNoArgConstructorClass;
                expect(typedInstanceCreationResult.a).to.be.an.instanceOf(NoArgConstructorClass);
            });
        });

        context(MultiLevelClass.name, () => {
            theClass(() => MultiLevelClass);
            expectClassToBeInstantiable();

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

            context('when we try to invoke its constructor with too few params', () => {
                it('yields an error', () => {
                    expect(() => new ReflectionDigestForTesting(collections()).MultiLevelClass.theConstructor.invoke([])).to.throw;
                });
            });
        });

        context(ClassWhoseConstructorTakesAnInterfaceParameter.name, () => {
            theClass(() => ClassWhoseConstructorTakesAnInterfaceParameter);
            expectClassToBeInstantiable();
            it(`has been constructed with the right implementation`, () => {
                const instance = instanceCreationResult() as ClassWhoseConstructorTakesAnInterfaceParameter;
                expect(instance.a).to.be.an.instanceOf(InterfaceImplementor);
                expect(instance.a.a).to.be.an.instanceOf(NoArgConstructorClass);
            });

            //TODO: Test for what happens when there are multiple implementors (should yield an error)
        });

        context(ClassThatNeedsFactory.name, () => {
            theClass(() => ClassThatNeedsFactory);
            expectClassToBeInstantiable();
            it(`can successfully call factory and produce an injected result`, () => {
                const instance = instanceCreationResult() as ClassThatNeedsFactory;
                expect(instance.noArgConstructorClassInstance).to.be.an.instanceOf(NoArgConstructorClass);
            });
        });

        //TODO: Support Factories
        //TODO: Support Choosing an Implementation of Interface when multiple exist
        //TODO: Support most general instantiation hook that could work for either above special cases
        //TODO: Support lifecycles - singleton (one per injector) vs. normal (create instances every time)
        //TODO: Support Proxying Object creation until objects are needed

    });
});
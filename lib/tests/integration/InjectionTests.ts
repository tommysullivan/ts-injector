import "../support/prepare-test-environment";
import {expect} from "chai";
import {Let} from "mocha-let-ts";
import {
    ClassWhoseConstructorRequiresFactoryThatWhenCalledAfterConstructionHasCompeltedYieldsIDependencyInterface,
    ClassWhoseConstructorDependsOnNoArgConstructorClass, ClassWhoseConstructorTakesAnInterfaceParameter, InterfaceImplementor,
    MultiLevelClass,
    NoArgConstructorClass
} from "../support/fake-types/fakeTypes";
import {collections} from "../support/shared-lets";
import {ReflectionDigestForTesting} from "../support/fake-types/ReflectionDigestForTesting";
import {NativeClassReference} from "../../private-devops-ts-injector/reflection/interfaces";
import {ValueProviderBasedOnClass} from "../../private-devops-ts-injector/injection/ValueProviderBasedOnClass";
import {Injection} from "../../private-devops-ts-injector/injection/Injection";

const xcontext = xdescribe;

describe(ValueProviderBasedOnClass.name, () => {

    function argumentNameToValueDictionaryProvider() {
        return collections.newDictionary(argumentNameToValueJSON());
    }

    const argumentNameToValueJSON = Let(() => ({
        arg1: 'val1',
        arg2: 'val2',
        newDependencyInterface: () => injection().valueProviderBasedOnInterface().provideValueBasedOn(reflectionDigest().IDependencyInterface)
    }));

    const injection = Let(() => new Injection(collections, argumentNameToValueDictionaryProvider));

    const reflectionDigest = Let(() => new ReflectionDigestForTesting(
        collections
    ));

    it('is instantiable', () => expect(injection().valueProviderBasedOnClass(reflectionDigest())).to.be.an.instanceof(ValueProviderBasedOnClass));

    describe("createInstanceOf<ClassToInstantiate>(theClass: NativeClassReference<ClassToInstantiate>)", () => {

        const theClass = Let<NativeClassReference<any>>();
        const instanceCreationResult = Let(() => injection().valueProviderBasedOnClass(reflectionDigest()).provideValueBasedOn(theClass()));

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
                    expect(() => new ReflectionDigestForTesting(collections).MultiLevelClass.theConstructor.invoke([])).to.throw;
                });
            });
        });

        context(ClassWhoseConstructorTakesAnInterfaceParameter.name, () => {
            theClass(() => ClassWhoseConstructorTakesAnInterfaceParameter);
            expectClassToBeInstantiable();
            it(`has been constructed with the right implementation`, () => {
                const instance = instanceCreationResult() as ClassWhoseConstructorTakesAnInterfaceParameter;
                expect(instance.a).to.be.an.instanceOf(InterfaceImplementor);
                expect(instance.a.d).to.be.an.instanceOf(NoArgConstructorClass);
            });

            //TODO: Test for what happens when there are multiple implementors (should yield an error)
            //TODO: Test for what happens when there are zero implementors (should yield an error)
        });

        context(ClassWhoseConstructorRequiresFactoryThatWhenCalledAfterConstructionHasCompeltedYieldsIDependencyInterface.name, () => {
            theClass(() => ClassWhoseConstructorRequiresFactoryThatWhenCalledAfterConstructionHasCompeltedYieldsIDependencyInterface);
            expectClassToBeInstantiable();
            it(`can successfully call factory and produce an injected result`, () => {
                const instance = instanceCreationResult() as ClassWhoseConstructorRequiresFactoryThatWhenCalledAfterConstructionHasCompeltedYieldsIDependencyInterface;
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
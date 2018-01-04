import "../support/prepare-test-environment";
import {expect} from "chai";
import {Let} from "mocha-let-ts";
import {
    ClassWhoseConstructorDependsOnNoArgConstructorClass,
    ClassWhoseConstructorRequiresFactoryThatWhenCalledAfterConstructionHasCompeltedYieldsIDependencyInterface,
    ClassWhoseConstructorTakesAnInterfaceParameter,
    InterfaceImplementor,
    MultiLevelClass,
    NoArgConstructorClass
} from "../support/fake-types/fakeTypes";
import {ReflectionDigestForTesting} from "../support/fake-types/ReflectionDigestForTesting";
import {NativeClassReference} from "../../private-devops-ts-injector/reflection/interfaces";
import {Injection} from "../../private-devops-ts-injector/injection/Injection";
import {Reflector} from "../../private-devops-ts-injector/reflection/Reflector";
import {ValueProviderBasedOnIClass} from "../../private-devops-ts-injector/injection/ValueProviderBasedOnIClass";
import {collections, reflectionDigest} from "../support/sharedLets";

const xcontext = xdescribe;

describe(Injection.name, () => {

    function argumentNameToValueDictionaryProvider() {
        return collections().newDictionary(argumentNameToValueJSON());
    }

    const argumentNameToValueJSON = Let(() => ({
        arg1: 'val1',
        arg2: 'val2',
        newDependencyInterface: () => injection().valueProviderBasedOnInterface().provideValueBasedOn(reflectionDigest().IDependencyInterface)
    }));

    const injection = Let(() => new Injection(collections(), argumentNameToValueDictionaryProvider));

    it('is instantiable', () => {
        expect(injection()).to.be.an.instanceOf(Injection);
    });

    describe(ValueProviderBasedOnIClass.name, () => {

        it('is instantiable', () => expect(injection().valueProviderBasedOnIClass()).to.be.an.instanceof(ValueProviderBasedOnIClass));

        describe("createInstanceOf<ClassToInstantiate>(theClass: NativeClassReference<ClassToInstantiate>)", () => {

            const theClass = Let<NativeClassReference<any>>();
            const reflector = Let(() => new Reflector(reflectionDigest()));
            const theIClass = Let(() => reflector().classOf(theClass()));
            const instanceCreationResult = Let(() =>
                injection().valueProviderBasedOnIType().provideValueBasedOn(theIClass())
            );

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
                it('has member a of type NoArgConstructorClass', () => {
                    const typedInstanceCreationResult = instanceCreationResult() as ClassWhoseConstructorDependsOnNoArgConstructorClass;
                    expect(typedInstanceCreationResult.a).to.be.an.instanceOf(NoArgConstructorClass);
                    expect(typedInstanceCreationResult.a.isNoArgConstructorClass).to.be.true;
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
                    expect(instance.a.d).to.be.an.instanceOf(NoArgConstructorClass);
                });

                //TODO: Test for what happens when there are multiple implementors (should yield an error)
                //TODO: Test for what happens when there are zero implementors (should yield an error)
            });

            xcontext(ClassWhoseConstructorRequiresFactoryThatWhenCalledAfterConstructionHasCompeltedYieldsIDependencyInterface.name, () => {
                theClass(() => ClassWhoseConstructorRequiresFactoryThatWhenCalledAfterConstructionHasCompeltedYieldsIDependencyInterface);
                expectClassToBeInstantiable();
                it(`can successfully call factory and produce an injected result`, () => {
                    const instance = instanceCreationResult() as ClassWhoseConstructorRequiresFactoryThatWhenCalledAfterConstructionHasCompeltedYieldsIDependencyInterface;
                    expect(instance.noArgConstructorClassInstance).to.be.an.instanceOf(NoArgConstructorClass);
                });
            });
        });
    });
});
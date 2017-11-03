import "../support/prepare-test-environment";
import {expect} from "chai";
import {Let} from "mocha-let-ts";
import { Injector } from "../../private-devops-ts-injector/dependency-injection/Injector";
import {Class} from "../../private-devops-ts-injector/reflection/Class";
import { ClassWhoseConstructorDependsOnNoArgConstructorClass, MultiLevelClass, NoArgConstructorClass } from "../support/fake-types/fakeTypes";
import {injector} from "../support/shared-lets";
import {Constructor} from "../../private-devops-ts-injector/reflection/Constructor";
import {ReflectionDigestForTesting} from "../support/fake-types/ReflectionDigestForTesting";

const xcontext = xdescribe;

describe('injector', () => {
    describe('constructor', () => {
        it('returns an instance', () => expect(injector()).to.be.an.instanceof(Injector));
    });

    describe("createInstanceOf<ClassToInstantiate>(theClass: NativeClassReference<ClassToInstantiate>)", () => {

        const theClass = Let<any>();
        const instanceCreationResult = Let(() => injector().createInstanceOf(theClass()));

        // MultiLevelClass

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
                    expect(() => new ReflectionDigestForTesting().MultiLevelClass.constructor.invoke([])).to.throw;
                });
            });
        });

    });
});
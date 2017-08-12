import "../support/prepare-test-environment";
import {expect} from "chai";
import {Let} from "mocha-let-ts";
import {NotImplementedError} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/errors/not-implemented-error";
import { Injector } from "../../private-devops-ts-injector/dependency-injection/injector";
import {Reflector} from "../../private-devops-ts-injector/reflection/reflector";
import {Class} from "../../private-devops-ts-injector/reflection/class";
import {CustomValueResolver} from "./custom-value-resolver";
import {typeMetadataFakedForTestPurposes} from "../fake-types/fakeTypeMetadata";

import {
    ClassWhoseConstructorDependsOnNoArgConstructorClass, MultiLevelClass, nativeClassReferences,
    NoArgConstructorClass
} from "../fake-types/fakeTypes";

describe('injector', () => {
    const customValueResolver = Let(() => new CustomValueResolver(reflector()));
    const reflector = Let(() => new Reflector(typeMetadataFakedForTestPurposes, nativeClassReferences));
    const injector = Let(() => new Injector(reflector(), customValueResolver()));

    it('is instantiable', () => expect(injector()).to.be.an.instanceof(Injector));

    describe("createInstanceOf<ClassToInstantiate>(theClass: NativeClassReference<ClassToInstantiate>)", () => {

        const theClass = Let<any>(() => { throw new NotImplementedError() });
        const instanceCreationResult = Let(() => injector().createInstanceOf(theClass()));

        nativeClassReferences.forEach(nativeClassReference => {
            const classUnderTest = new Class(nativeClassReference, typeMetadataFakedForTestPurposes, new Reflector(typeMetadataFakedForTestPurposes, nativeClassReferences));
            context(`when classUnderTest is class named "${classUnderTest.name}"`, () => {
                theClass(() => nativeClassReference);
                it('returns a new instance', () => {
                    expect(instanceCreationResult()).to.be.an.instanceof(theClass());
                });
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
    });
});
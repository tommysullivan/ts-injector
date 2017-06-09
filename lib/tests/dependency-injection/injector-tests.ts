import "../support/prepare-test-environment";
import {expect} from "chai";
import {Let} from "mocha-let-ts";
import {
    Class, IArgument, ICustomValueResolver, Injector, IType,
    Reflector
} from "../../private-devops-ts-primitives/dependency-injection/injector";
import {NotImplementedError} from "../../private-devops-ts-primitives/errors/not-implemented-error";
import {Console, LogLevel} from "../../private-devops-ts-primitives/console/console";
import * as readLineSync from "readline-sync";
import {mock} from "mocha-let-ts/dist/mocha-let-ts/mock";
import * as sinon from "sinon";

describe('injector @wip', () => {
    class NoArgConstructorClass {}

    class ClassWhoseConstructorDependsOnNoArgConstructorClass {
        constructor(
            public readonly a:NoArgConstructorClass
        ) {}
    }

    class MultiLevelClass {
        constructor(
            public readonly a:NoArgConstructorClass,
            public readonly b:ClassWhoseConstructorDependsOnNoArgConstructorClass,
            public readonly c:ClassWhoseConstructorDependsOnNoArgConstructorClass
        ) {}
    }

    const fakeTypeMetadata = {
        "classes": [
            {
                "name": "NoArgConstructorClass",
                "constructorArgs": []
            },
            {
                "name": "ClassWhoseConstructorDependsOnNoArgConstructorClass",
                "constructorArgs": [
                    { "name": "a", "typeName": "NoArgConstructorClass"}
                ]
            },
            {
                "name": "MultiLevelClass",
                "constructorArgs": [
                    { "name": "a", "typeName": "NoArgConstructorClass"},
                    { "name": "b", "typeName": "ClassWhoseConstructorDependsOnNoArgConstructorClass"},
                    { "name": "c", "typeName": "ClassWhoseConstructorDependsOnNoArgConstructorClass"}
                ]
            },
            {
                "name": "Console",
                "constructorArgs": [
                    { "name": "nativeConsole", "typeName": "any"},
                    { "name": "readLineSyncModule", "typeName": "any"},
                    { "name": "logLevel", "typeName": "LogLevel"}
                ]
            }
        ]
    };

    const nativeClassReferences = [
        NoArgConstructorClass,
        ClassWhoseConstructorDependsOnNoArgConstructorClass,
        MultiLevelClass,
        Console
    ];

    const mockNativeConsole = Let(() => mock<any>({log() {}}));

    class CustomValueResolver implements ICustomValueResolver {

        //TODO: Cool way to provide custom factory with most work done by DI before calling it
        customLogLevel(readLineSyncModule:any, logLevel:LogLevel):Console {
            const nativeConsole = console;
            return new Console(nativeConsole, readLineSyncModule, logLevel);
        }

        instanceForType(type: IType, injector):any {
            if(type.name=='LogLevel') return 'INFO';
        }

        resolveArgumentValue(arg: IArgument): any {
            if(arg.name=='nativeConsole') return mockNativeConsole();
            else if(arg.name=='readLineSyncModule') return readLineSync;
        }

        instanceForTypeWhenAutomaticConstructionFails(type: IType): any {}
    }

    const customValueResolver = Let(() => new CustomValueResolver());
    const reflector = Let(() => new Reflector(fakeTypeMetadata, nativeClassReferences));
    const injector = Let(() => new Injector(reflector(), customValueResolver()));
    const theClass = Let<any>(() => { throw new NotImplementedError() });

    it('is instantiable', () => expect(injector()).to.be.an.instanceof(Injector));

    describe('createInstanceOf<ClassToInstantiate>(theClass: NativeClassReference<ClassToInstantiate>)', () => {

        const instanceCreationResult = Let(() => injector().createInstanceOf(theClass()));

        const expectNewInstance = () => {
            it('returns a new instance', () => {
                expect(instanceCreationResult()).to.be.an.instanceof(theClass());
            });
        };

        nativeClassReferences.forEach(nativeClassReference => {
            const classUnderTest = new Class(nativeClassReference, fakeTypeMetadata, new Reflector(fakeTypeMetadata, nativeClassReferences));
            context(classUnderTest.name, () => {
                theClass(() => nativeClassReference);
                expectNewInstance();
            });
        });

        context('MultiLevelClass', () => {
            theClass(() => MultiLevelClass);
            expectNewInstance();

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

        context('Console Usage', () => {
            it('works', () => {
                injector().createInstanceOf(Console).info('some info');
                injector().createInstanceOf(Console).warn('some warning');
                injector().createInstanceOf(Console).error('some error');
                expect(mockNativeConsole().log).to.have.been.calledWith(sinon.match.string, 'some error');
                expect(mockNativeConsole().log).to.have.been.calledWith(sinon.match.string, 'some warning');
                expect(mockNativeConsole().log).to.have.been.calledWith(sinon.match.string, 'some info');
            });
        });
    });
});